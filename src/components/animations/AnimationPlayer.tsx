"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question, AnimationStep, VizMode } from "@/data/types";
import ArrayViz from "./ArrayViz";
import StringViz from "./StringViz";
import BarChartViz from "./BarChartViz";
import { useMaterialVarChanges } from "./hooks";

interface AnimationPlayerProps {
  question: Question;
}

const SPEEDS = [0.5, 1, 2, 4] as const;

export default function AnimationPlayer({ question }: AnimationPlayerProps) {
  const steps = useMemo(() => question.buildTrace(), [question]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const step = steps[stepIdx];
  const prevStep = stepIdx > 0 ? steps[stepIdx - 1] : undefined;
  const { arrayData, stringData, primaryLabel } = parseSampleInput(question.sampleInput);
  const vizMode = resolveVizMode(question, arrayData, stringData);

  // Detect which variables changed for selective pill flash.
  const changedVars = useMaterialVarChanges(step.variables);

  // Auto-play loop
  useEffect(() => {
    if (!playing) return;
    const base = 950;
    const delay = base / speed;
    const t = setTimeout(() => {
      setStepIdx((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, delay);
    return () => clearTimeout(t);
  }, [playing, stepIdx, speed, steps.length]);

  // Reset on question change
  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [question.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement) && document.activeElement !== containerRef.current) {
        const tag = (document.activeElement as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      }
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setStepIdx((i) => Math.min(steps.length - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setStepIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        setStepIdx(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setStepIdx(steps.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steps.length]);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-1)] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-4 py-2">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="tabular rounded bg-[color:var(--surface-3)] px-2 py-0.5 font-mono text-[color:var(--text-secondary)]">
            Step {stepIdx + 1} / {steps.length}
          </span>
          {question.sampleInput.slice(0, 2).map((s) => (
            <span
              key={s.label}
              className="rounded border border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] px-2 py-0.5 font-mono text-[color:var(--text-secondary)]"
            >
              <span className="text-[color:var(--accent)]">{s.label}</span>={s.value}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1 text-[10px] text-muted">
          <Kbd>Space</Kbd> play · <Kbd>←</Kbd>
          <Kbd>→</Kbd> step
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-[color:var(--surface-3)]">
        <motion.div
          className="h-full bg-[color:var(--accent)]"
          animate={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.25 }}
        />
      </div>

      {/* Centered visualization */}
      <div className="relative flex min-h-[260px] flex-col items-center justify-center bg-[color:var(--surface-0)] px-4 py-8 md:min-h-[360px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--border-default)] to-transparent opacity-40" />
        <div className="min-h-[240px]">
          {vizMode === "array" && arrayData && (
            <ArrayViz step={step} data={arrayData} label={primaryLabel} prevStep={prevStep} />
          )}
          {vizMode === "string" && stringData && (
            <StringViz step={step} data={stringData} label={primaryLabel} prevStep={prevStep} />
          )}
          {vizMode === "bar" && arrayData && (
            <BarChartViz step={step} data={arrayData} label={primaryLabel} prevStep={prevStep} />
          )}
          {vizMode === "none" && (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center">
              <div className="text-[12px] font-medium text-[color:var(--text-secondary)]">
                Animation coming soon
              </div>
              <div className="max-w-[36ch] text-[11px] leading-relaxed text-muted">
                This question is in the stub list — the trace, code, and
                explanation are ready; the visualization will land in a
                follow-up.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Variables strip */}
      {Object.keys(step.variables ?? {}).length > 0 && (
        <div className="border-t border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-4 py-2.5">
          <motion.div layout className="flex flex-wrap items-center justify-center gap-2">
            <AnimatePresence mode="popLayout">
              {Object.entries(step.variables ?? {}).map(([k, v]) => (
                <VarPill
                  key={k}
                  name={k}
                  value={v as string | number | string[] | number[] | null}
                  changed={changedVars.has(k)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Step description */}
      <div className="border-t border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] px-4 py-3 text-center">
        <motion.p
          key={stepIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="mx-auto max-w-2xl text-sm leading-relaxed text-[color:var(--text-primary)]"
        >
          {step.description}
        </motion.p>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-3 py-2.5 md:px-4">
        <CtrlBtn onClick={() => setStepIdx(0)} disabled={stepIdx === 0} ariaLabel="First step">
          <Icon name="first" />
        </CtrlBtn>
        <CtrlBtn
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          disabled={stepIdx === 0}
          ariaLabel="Previous step"
        >
          <Icon name="prev" />
        </CtrlBtn>
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--accent)] text-[color:var(--surface-0)] shadow-[0_0_0_4px_var(--accent-soft)] transition-transform hover:scale-[1.06] active:scale-95 md:h-9 md:w-9"
        >
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.span
                key="pause"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.12 }}
              >
                <Icon name="pause" />
              </motion.span>
            ) : (
              <motion.span
                key="play"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.12 }}
              >
                <Icon name="play" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <CtrlBtn
          onClick={() => setStepIdx((i) => Math.min(steps.length - 1, i + 1))}
          disabled={stepIdx === steps.length - 1}
          ariaLabel="Next step"
        >
          <Icon name="next" />
        </CtrlBtn>
        <CtrlBtn
          onClick={() => setStepIdx(steps.length - 1)}
          disabled={stepIdx === steps.length - 1}
          ariaLabel="Last step"
        >
          <Icon name="last" />
        </CtrlBtn>

        <div className="ml-2 hidden h-5 w-px bg-[color:var(--border-subtle)] sm:block" />

        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className="hidden sm:inline">Speed</span>
          <div className="flex rounded-md border border-[color:var(--border-default)] bg-[color:var(--surface-1)] p-0.5">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                aria-pressed={speed === s}
                className={`rounded px-2.5 py-1 tabular text-[11px] transition-colors md:px-2 md:py-0.5 ${
                  speed === s
                    ? "bg-[color:var(--accent)] text-[color:var(--surface-0)]"
                    : "text-muted hover:text-[color:var(--text-primary)]"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto tabular text-[10px] text-muted">
          {step.codeLine ? `line ${step.codeLine}` : ""}
        </div>
      </div>
    </div>
  );
}

// ─── Viz mode resolution ─────────────────────────────────────────────────────

function resolveVizMode(
  question: Question,
  arrayData: number[] | null,
  stringData: string | null,
): VizMode {
  if (question.vizMode) return question.vizMode;
  if (stringData) return "string";
  if (arrayData) return "array";
  return "none";
}

// ─── Atoms ──────────────────────────────────────────────────────────────────

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-4 min-w-4 items-center justify-center rounded border border-[color:var(--border-default)] bg-[color:var(--surface-3)] px-1 font-mono text-[9px] text-[color:var(--text-secondary)]">
      {children}
    </kbd>
  );
}

function CtrlBtn({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-[color:var(--border-default)] bg-[color:var(--surface-1)] text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--surface-3)] hover:text-[color:var(--text-primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[color:var(--surface-1)] disabled:hover:text-[color:var(--text-secondary)] md:h-8 md:w-8"
    >
      {children}
    </button>
  );
}

function Icon({ name }: { name: "first" | "prev" | "next" | "last" | "play" | "pause" }) {
  const props = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "currentColor",
    strokeWidth: 0,
  };
  switch (name) {
    case "first":
      return (
        <svg {...props}>
          <path d="M6 4h2v16H6zM20 4l-12 8 12 8z" />
        </svg>
      );
    case "prev":
      return (
        <svg {...props}>
          <path d="M18 4l-12 8 12 8z" />
        </svg>
      );
    case "next":
      return (
        <svg {...props}>
          <path d="M6 4l12 8-12 8z" />
        </svg>
      );
    case "last":
      return (
        <svg {...props}>
          <path d="M16 4h2v16h-2zM4 4l12 8-12 8z" />
        </svg>
      );
    case "play":
      return (
        <svg {...props}>
          <path d="M7 4l13 8-13 8z" />
        </svg>
      );
    case "pause":
      return (
        <svg {...props}>
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      );
  }
}

// ─── Variable pill ──────────────────────────────────────────────────────────

function VarPill({
  name,
  value,
  changed,
}: {
  name: string;
  value: string | number | string[] | number[] | null;
  changed: boolean;
}) {
  const { type, display } = describeValue(value);
  const dotColor = typeColor(type);
  return (
    <motion.div
      layout="position"
      animate={{
        backgroundColor: changed ? "var(--state-considered-soft)" : "rgba(255,255,255,0.04)",
        borderColor: changed ? "var(--state-considered)" : "rgba(255,255,255,0.08)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px]"
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
      <span className="text-[color:var(--text-tertiary)]">{name}</span>
      <span className="text-[color:var(--text-tertiary)]">=</span>
      <span className="tabular text-[color:var(--text-primary)]">{display}</span>
    </motion.div>
  );
}

function describeValue(v: unknown): { type: string; display: string } {
  if (v === null) return { type: "null", display: "null" };
  if (Array.isArray(v)) {
    if (v.length > 8) {
      return { type: "arr", display: `[${v.slice(0, 6).join(",")}…+${v.length - 6}]` };
    }
    return { type: "arr", display: `[${v.join(", ")}]` };
  }
  if (typeof v === "number") return { type: "num", display: String(v) };
  return { type: "str", display: String(v) };
}

function typeColor(t: string) {
  return t === "arr"
    ? "var(--state-considered)"
    : t === "num"
    ? "var(--accent)"
    : t === "str"
    ? "var(--state-matched)"
    : "var(--text-tertiary)";
}

// ─── Input parsing ──────────────────────────────────────────────────────────

function parseSampleInput(input: { label: string; value: string }[]) {
  let arrayData: number[] | null = null;
  let stringData: string | null = null;
  let primaryLabel = input[0]?.label ?? "input";

  for (const { label, value } of input) {
    const v = value.trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      const inner = v.slice(1, -1);
      const nums = inner.split(",").map((s) => Number(s.trim()));
      if (nums.every((n) => !Number.isNaN(n))) {
        arrayData = nums;
        primaryLabel = label;
        continue;
      }
    }
    if (v.startsWith('"') && v.endsWith('"')) {
      stringData = v.slice(1, -1);
      primaryLabel = label;
    }
  }
  return { arrayData, stringData, primaryLabel };
}

// Re-export so consumers can reach it via this module if desired.
export type { AnimationStep };
