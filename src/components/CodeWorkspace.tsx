"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Question, Topic } from "@/data/types";
import CodeEditor from "./CodeEditor";
import AnimationPlayer from "./animations/AnimationPlayer";
import { useCodeRunner } from "@/hooks/useCodeRunner";

interface CodeWorkspaceProps {
  topic: Topic;
  question: Question;
  onClose: () => void;
}

const MIN_PANE_PERCENT = 28;
const MAX_PANE_PERCENT = 72;

function starterCode(question: Question) {
  return `// ${question.title}
// Difficulty: ${question.difficulty} · Tags: ${question.tags.join(", ")}
//
// Write your solution below. You can use console.log() to test output.
// Click "Run code" when you're ready.

function solve(/* args */) {
  // your code here
}

// Example: try your function with the sample input
// console.log(solve(...));
`;
}

export default function CodeWorkspace({ topic, question, onClose }: CodeWorkspaceProps) {
  const [code, setCode] = useState(() => starterCode(question));
  const [editorKey, setEditorKey] = useState(() => `${question.id}-starter`);
  const [showSolution, setShowSolution] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { logs, result, error, running, run, reset: resetRunner } = useCodeRunner();

  useEffect(() => {
    // Reset editor when the question changes while in code mode.
    setCode(starterCode(question));
    setEditorKey(`${question.id}-starter`);
    setShowSolution(false);
    resetRunner();
  }, [question.id, resetRunner, question]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    const container = containerRef.current;
    if (!container) return;

    const move = (ev: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplit(Math.max(MIN_PANE_PERCENT, Math.min(MAX_PANE_PERCENT, pct)));
    };

    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, []);

  const loadSolution = () => {
    setShowSolution(true);
    setCode(question.solution);
    setEditorKey(`${question.id}-solution`);
  };

  const resetStarter = () => {
    setShowSolution(false);
    setCode(starterCode(question));
    setEditorKey(`${question.id}-starter-${Date.now()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-30 flex flex-col bg-[color:var(--surface-0)]"
    >
      {/* Top toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] px-4 py-2.5 md:px-5">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            aria-label="Back to Learn mode"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-2)] px-3 py-2 text-[12px] font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)] active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Learn
          </button>
          <div className="hidden flex-col truncate sm:flex">
            <span className="text-[12px] font-medium text-[color:var(--text-primary)]">{question.title}</span>
            <span className="text-[10.5px] text-muted">{topic.shortName} · {question.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetStarter}
            disabled={!showSolution}
            className="hidden items-center gap-1.5 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-2)] px-3 py-2 text-[12px] font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)] active:scale-95 disabled:opacity-40 sm:inline-flex"
          >
            Reset
          </button>
          <button
            onClick={loadSolution}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--accent)]/30 bg-[color:var(--accent-soft)] px-3 py-2 text-[12px] font-medium text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)]/20 active:scale-95"
          >
            Show solution
          </button>
          <button
            onClick={() => setShowAnimation((s) => !s)}
            aria-pressed={showAnimation}
            aria-label="Toggle animation panel"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors active:scale-95 ${
              showAnimation
                ? "border-[color:var(--accent)]/40 bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                : "border-[color:var(--border-default)] bg-[color:var(--surface-2)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Animation
          </button>
          <button
            onClick={() => run(code)}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-[12px] font-semibold text-[color:var(--surface-0)] shadow-sm transition-colors hover:bg-[color:var(--accent-hover)] active:scale-95 disabled:opacity-60"
          >
            {running ? (
              <>
                <Spinner />
                Running…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Run code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split panes */}
      <div
        ref={containerRef}
        className={`relative flex flex-1 overflow-hidden ${dragging ? "select-none" : ""}`}
      >
        {/* Explanation pane */}
        <div
          className="hidden h-full flex-col overflow-y-auto border-r border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] md:flex"
          style={{ width: `${split}%` }}
        >
          <div className="space-y-6 p-5 md:p-6">
            <div>
              <h1 className="text-[18px] font-semibold leading-tight tracking-[-0.01em] text-[color:var(--text-primary)] md:text-[20px]">
                {question.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <span className="rounded bg-[color:var(--surface-2)] px-2 py-0.5 font-medium text-[color:var(--text-secondary)]">{topic.shortName}</span>
                <span>·</span>
                <span className={difficultyColor(question.difficulty)}>{question.difficulty}</span>
                {question.tags.map((t) => (
                  <span key={t} className="rounded border border-[color:var(--border-subtle)] px-1.5 py-0.5">{t}</span>
                ))}
              </div>
            </div>

            <ProblemSection title="Problem">
              <p className="prose-col text-[13.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[14px]">
                {question.problem}
              </p>
              {question.constraints.length > 0 && (
                <div className="mt-4">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Constraints</div>
                  <ul className="space-y-1.5 text-[12.5px] text-muted">
                    {question.constraints.map((c, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--text-tertiary)]" />
                        <code className="rounded border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-1.5 py-0.5 text-[12px] text-[color:var(--text-primary)]">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {question.sampleInput.length > 0 && (
                <div className="mt-4 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] p-3">
                  <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Sample input</div>
                  <div className="space-y-1 font-mono text-[12px] text-[color:var(--text-secondary)]">
                    {question.sampleInput.map((s) => (
                      <div key={s.label}>
                        <span className="text-[color:var(--accent)]">{s.label}</span> = {s.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ProblemSection>

            <ProblemSection title="Approach">
              <p className="prose-col text-[13.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[14px]">
                {question.approach}
              </p>
            </ProblemSection>

            <ProblemSection title="Dry run">
              <ol className="space-y-1.5 text-[12.5px] leading-[1.75] text-[color:var(--text-primary)]">
                {question.dryRun.map((line, i) => (
                  <li key={i} className="flex gap-3 font-mono">
                    <span className="tabular w-6 shrink-0 select-none text-right text-[color:var(--text-tertiary)]">{i + 1}</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </ProblemSection>

            <Link
              href={`/topic/${topic.id}/question/${question.id}`}
              onClick={onClose}
              className="block text-center text-[12px] text-muted transition-colors hover:text-[color:var(--accent)]"
            >
              Read full learning stations →
            </Link>
          </div>
        </div>

        {/* Mobile explanation toggle */}
        <MobileExplanation question={question} topic={topic} />

        {/* Resize handle */}
        <div
          onPointerDown={onPointerDown}
          className="hidden cursor-col-resize flex-col items-center justify-center bg-[color:var(--surface-1)] px-0.5 transition-colors hover:bg-[color:var(--surface-2)] md:flex"
          style={{ marginLeft: "-4px", marginRight: "-4px", zIndex: 2 }}
          aria-hidden
        >
          <div className="h-8 w-1 rounded-full bg-[color:var(--border-strong)]" />
        </div>

        {/* Editor pane */}
        <div className="flex h-full min-w-0 flex-1 flex-col bg-[color:var(--surface-0)]">
          <div className="flex-1 overflow-hidden p-3 md:p-4">
            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-1)]">
              <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-3 py-2">
                <span className="text-[11px] font-medium text-muted">Editor · JavaScript</span>
                {showSolution && (
                  <span className="rounded bg-[color:var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--accent)]">Reference</span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  key={editorKey}
                  initialValue={code}
                  onChange={setCode}
                  className="bg-[color:var(--surface-0)]"
                />
              </div>
            </div>
          </div>

          {/* Output console */}
          <div className="h-[200px] min-h-[160px] shrink-0 border-t border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] md:h-[240px]">
            <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-4 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Console</span>
              <div className="flex items-center gap-2">
                {(logs.length > 0 || result !== undefined || error) && (
                  <button
                    onClick={resetRunner}
                    className="text-[11px] text-muted transition-colors hover:text-[color:var(--text-primary)]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="h-[calc(100%-33px)] overflow-y-auto p-4 font-mono text-[12.5px]">
              {running && logs.length === 0 && !error && (
                <div className="flex items-center gap-2 text-muted">
                  <Spinner />
                  Running your code…
                </div>
              )}
              {!running && logs.length === 0 && result === undefined && !error && (
                <div className="text-muted">Click “Run code” to see output here.</div>
              )}
              {logs.map((line, i) => (
                <div key={i} className="border-b border-[color:var(--border-subtle)] py-1 text-[color:var(--text-secondary)] last:border-0">
                  <span className="mr-2 text-[color:var(--text-tertiary)]">›</span>
                  {line}
                </div>
              ))}
              {result !== undefined && (
                <div className="mt-2 rounded border border-[color:var(--accent)]/20 bg-[color:var(--accent-soft)] p-2 text-[color:var(--accent)]">
                  <span className="mr-2 text-[color:var(--accent)]/70">return</span>
                  {result}
                </div>
              )}
              {error && (
                <div className="mt-2 rounded border border-[color:var(--diff-hard)]/20 bg-[color:var(--state-rejected-soft)] p-2 text-[color:var(--diff-hard)]">
                  <span className="mr-2 font-semibold">Error:</span>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Animation overlay */}
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 right-0 top-0 z-10 flex w-full flex-col border-l border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] md:w-[55%]"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-4 py-2.5">
              <span className="text-[12px] font-semibold text-[color:var(--text-primary)]">Animation</span>
              <button
                onClick={() => setShowAnimation(false)}
                aria-label="Close animation panel"
                className="rounded-md p-1 text-muted transition-colors hover:bg-[color:var(--surface-3)] hover:text-[color:var(--text-primary)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <AnimationPlayer question={question} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function MobileExplanation({ topic, question }: { topic: Topic; question: Question }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="absolute left-4 top-3 z-10 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-2)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--text-secondary)] shadow-sm"
      >
        {open ? "Hide problem" : "Show problem"}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-4 right-4 top-12 z-10 max-h-[70vh] overflow-y-auto rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-1)] p-4 shadow-lg"
        >
          <h2 className="mb-2 text-[15px] font-semibold text-[color:var(--text-primary)]">{question.title}</h2>
          <p className="mb-3 text-[12.5px] leading-relaxed text-[color:var(--text-primary)]">{question.problem}</p>
          {question.sampleInput.length > 0 && (
            <div className="mb-3 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] p-2.5 font-mono text-[11px]">
              {question.sampleInput.map((s) => (
                <div key={s.label}><span className="text-[color:var(--accent)]">{s.label}</span> = {s.value}</div>
              ))}
            </div>
          )}
          <p className="text-[12px] leading-relaxed text-muted">{question.approach}</p>
          <Link
            href={`/topic/${topic.id}/question/${question.id}`}
            className="mt-3 block text-[12px] text-[color:var(--accent)]"
          >
            Read full stations →
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function ProblemSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{title}</span>
        <span className="h-px flex-1 bg-[color:var(--border-subtle)]" />
      </div>
      {children}
    </section>
  );
}

function difficultyColor(d: "Easy" | "Medium" | "Hard") {
  return d === "Easy" ? "text-[color:var(--diff-easy)]" : d === "Medium" ? "text-[color:var(--diff-medium)]" : "text-[color:var(--diff-hard)]";
}

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
    </svg>
  );
}
