"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface RunnerOutput {
  /** console.log lines captured during execution */
  logs: string[];
  /** Stringified return value of the last expression, if any */
  result?: string;
  /** Runtime error message */
  error?: string;
  /** True while the worker is running */
  running: boolean;
}

const WORKER_TIMEOUT_MS = 5000;

const RUNNER_WORKER_CODE = `
self.onmessage = function (e) {
  const code = e.data.code;
  const logs = [];
  const customConsole = {
    log: function (...args) {
      logs.push(args.map((a) => {
        if (typeof a === "object" && a !== null) {
          try { return JSON.stringify(a); } catch (_) { return String(a); }
        }
        return String(a);
      }).join(" "));
    },
    error: function (...args) {
      logs.push("[error] " + args.map(String).join(" "));
    },
  };

  const start = Date.now();
  function checkTimeout() {
    if (Date.now() - start > ${WORKER_TIMEOUT_MS}) {
      throw new Error("Execution timed out after ${WORKER_TIMEOUT_MS / 1000}s. Check for an infinite loop.");
    }
  }

  try {
    const fn = new Function("console", "checkTimeout", "\n\"use strict\";\nreturn (async () => {\n" + code + "\n})();\n");
    const promise = fn(customConsole, checkTimeout);
    Promise.resolve(promise)
      .then((value) => {
        let result;
        if (value !== undefined) {
          try {
            result = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value);
          } catch (_) {
            result = String(value);
          }
        }
        self.postMessage({ logs, result, done: true });
      })
      .catch((err) => {
        self.postMessage({ logs, error: err?.message || String(err), done: true });
      });
  } catch (err) {
    self.postMessage({ logs, error: err?.message || String(err), done: true });
  }
};
`;

export function useCodeRunner(): RunnerOutput & { run: (code: string) => void; reset: () => void } {
  const workerRef = useRef<Worker | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLogs([]);
    setResult(undefined);
    setError(undefined);
    setRunning(false);
  }, []);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const run = useCallback((code: string) => {
    reset();
    setRunning(true);

    const blob = new Blob([RUNNER_WORKER_CODE], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<{ logs?: string[]; result?: string; error?: string; done?: boolean }>) => {
      const data = e.data;
      if (data.logs) setLogs((prev) => [...prev, ...data.logs!]);
      if (data.result !== undefined) setResult(data.result);
      if (data.error) setError(data.error);
      if (data.done) {
        setRunning(false);
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      }
    };

    worker.onerror = (e) => {
      setError(e.message || "Worker error");
      setRunning(false);
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    timeoutRef.current = window.setTimeout(() => {
      setError(`Execution timed out after ${WORKER_TIMEOUT_MS / 1000}s. Check for an infinite loop.`);
      setRunning(false);
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    }, WORKER_TIMEOUT_MS + 100);

    worker.postMessage({ code });
  }, [reset]);

  return { logs, result, error, running, run, reset };
}
