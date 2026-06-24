"use client";

import { useCallback, useEffect, useState } from "react";

const MODE_KEY = "mode";
const CODE_VALUE = "code";
const CHANGE_EVENT = "dsa:codemodechange";

function getIsCodeMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get(MODE_KEY) === CODE_VALUE;
}

function updateUrl(codeMode: boolean) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (codeMode) {
    url.searchParams.set(MODE_KEY, CODE_VALUE);
  } else {
    url.searchParams.delete(MODE_KEY);
  }
  window.history.replaceState(window.history.state, "", url.toString());
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useCodeMode(): {
  codeMode: boolean;
  setCodeMode: (value: boolean) => void;
  toggleCodeMode: () => void;
} {
  const [codeMode, setCodeModeState] = useState(getIsCodeMode);

  useEffect(() => {
    setCodeModeState(getIsCodeMode());
    const onChange = () => setCodeModeState(getIsCodeMode());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);

  const setCodeMode = useCallback((value: boolean) => {
    setCodeModeState(value);
    updateUrl(value);
  }, []);

  const toggleCodeMode = useCallback(() => {
    setCodeModeState((prev) => {
      const next = !prev;
      updateUrl(next);
      return next;
    });
  }, []);

  return { codeMode, setCodeMode, toggleCodeMode };
}
