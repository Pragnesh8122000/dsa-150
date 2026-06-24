"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/data/types";
import { TOPIC_BY_ID } from "@/data/topics";
import { QUESTIONS, QUESTION_BY_ID } from "@/data/questions";
import { useProgress, PROGRESS_LABELS } from "@/context/ProgressContext";
import { useCodeMode } from "@/hooks/useCodeMode";
import AnimationPlayer from "./animations/AnimationPlayer";
import MobileBottomBar from "./MobileBottomBar";
import StationStrip from "./stations/StationStrip";
import Celebration from "./Celebration";
import CodeWorkspace from "./CodeWorkspace";

interface QuestionViewProps {
  topicId: string;
  questionId: string;
}

const STATUS_ORDER = ["not_started", "revisited", "confident"] as const;

export default function QuestionView({ topicId, questionId }: QuestionViewProps) {
  const topic = TOPIC_BY_ID[topicId];
  const question = QUESTION_BY_ID[questionId];
  const { progress, setStatus, visit } = useProgress();
  const status = progress[question.id] ?? "not_started";
  const router = useRouter();
  const { codeMode, setCodeMode, toggleCodeMode } = useCodeMode();
  const [celebrating, setCelebrating] = useState(false);

  const topicQuestions = useMemo(
    () => QUESTIONS.filter((q) => q.topicId === topic.id),
    [topic.id]
  );

  const nextPath = useMemo(() => {
    const idx = topicQuestions.findIndex((q) => q.id === question.id);
    const remaining = topicQuestions.filter((q) => (progress[q.id] ?? "not_started") !== "confident");
    const next =
      remaining.find((q) => topicQuestions.indexOf(q) > idx) ??
      remaining.find((q) => q.id !== question.id);
    return next ? `/topic/${topic.id}/question/${next.id}` : `/topic/${topic.id}`;
  }, [topicQuestions, progress, question.id, topic.id]);

  const markConfidentAndNext = useCallback(() => {
    setStatus(question.id, "confident");
    setCelebrating(true);
    const t = setTimeout(() => {
      setCelebrating(false);
      router.push(nextPath);
    }, 850);
    return () => clearTimeout(t);
  }, [question.id, setStatus, nextPath, router]);

  useEffect(() => {
    visit(question.id);
  }, [question.id, visit]);

  return (
    <>
      {codeMode && <CodeWorkspace topic={topic} question={question} onClose={() => setCodeMode(false)} />}

      {!codeMode && (
        <div className="mx-auto max-w-3xl px-5 py-6 pb-32 md:px-10 md:py-12 md:pb-12">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between md:mb-7">
            <Link
              href={`/topic/${topic.id}`}
              className="group flex items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-[color:var(--text-primary)] md:text-[12.5px]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to {topic.name}
            </Link>
            <div className="hidden items-center gap-3 md:flex">
              <StatusSegmented value={status} onChange={(s) => setStatus(question.id, s)} />
              <button
                onClick={() => setCodeMode(true)}
                aria-label="Open coding workspace"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-2)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)] active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 18 6-6-6-6" />
                  <path d="m8 6-6 6 6 6" />
                </svg>
                Open editor
              </button>
              <button
                onClick={markConfidentAndNext}
                aria-label="Mark confident and go to the next question"
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent-soft)] px-3.5 py-1.5 text-[12px] font-semibold text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)]/20 active:scale-95"
              >
                Mark confident & next
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-8 md:mb-12"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted md:text-[11px]">
              <span>{topic.shortName}</span>
              <span>·</span>
              <DifficultyDot difficulty={question.difficulty} />
              <span className={difficultyColor(question.difficulty)}>{question.difficulty}</span>
            </div>
            <h1 className="text-balance text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[32px]">
              {question.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {question.tags.map((t) => (
                <span
                  key={t}
                  className="rounded border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-2.5 py-0.5 text-[11px] text-muted md:text-[11.5px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.header>

          {/* Spark — intuition hook */}
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="mb-8 md:mb-10"
          >
            <SectionLabel eyebrow="Spark">Why this idea exists</SectionLabel>
            <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-5 md:p-6">
              <p className="prose-col text-[14.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[15px]">
                {question.intuition ?? sparkFor(question)}
              </p>
            </div>
          </motion.section>

          {/* Single-column learning flow */}
          <div className="min-w-0 space-y-8 md:space-y-10">
            <Section title="Problem" eyebrow="01">
              <p className="prose-col text-[14.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[15px]">
                {question.problem}
              </p>
              {question.constraints.length > 0 && (
                <div className="prose-col mt-6">
                  <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted md:text-[10.5px]">
                    Constraints
                  </div>
                  <ul className="space-y-1.5 text-[13px] text-muted md:text-[13.5px]">
                    {question.constraints.map((c, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--text-tertiary)]" />
                        <code className="rounded border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-1.5 py-0.5 text-[12.5px] text-[color:var(--text-primary)] md:text-[13px]">
                          {c}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>

            <Section title="Approach" eyebrow="02">
              <p className="prose-col text-[14.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[15px]">
                {question.approach}
              </p>
            </Section>

            <Section title="Dry run" eyebrow="03">
              <ol className="prose-col space-y-1.5 text-[13px] leading-[1.75] md:text-[13.5px]">
                {question.dryRun.map((line, i) => (
                  <li key={i} className="flex gap-3 font-mono">
                    <span className="tabular w-6 shrink-0 select-none text-right text-[color:var(--text-tertiary)]">
                      {i + 1}
                    </span>
                    <span className="text-[color:var(--text-primary)]">{line}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="Animation" eyebrow="04">
              <AnimationPlayer question={question} />
            </Section>
          </div>

          {/* Learning stations */}
          <StationStrip question={question} />
        </div>
      )}

      {!codeMode && (
        <MobileBottomBar
          topicId={topic.id}
          questionId={question.id}
          status={status}
          onStatusChange={(s) => setStatus(question.id, s)}
          onMarkConfidentNext={markConfidentAndNext}
          codeMode={codeMode}
          onToggleCodeMode={toggleCodeMode}
        />
      )}
      <Celebration active={celebrating} />
    </>
  );
}

function sparkFor(q: Question): string {
  // Placeholder intuition hooks until the full content rewrite lands.
  // These mirror the "why this idea exists" station from the redesign proposal.
  if (q.tags.includes("two-pointers")) {
    return "The brute force here is usually O(n²): try every pair. But if the input is sorted, or if moving one pointer tells you something definitive about the other, you can burn off half the search space at every step. That’s the two-pointer trick — and it usually drops you to O(n).";
  }
  if (q.tags.includes("sliding-window")) {
    return "A contiguous subarray/substring problem screams brute force: try every window. The smarter observation is that valid windows often overlap heavily. Slide one edge instead of recomputing from scratch, and each element enters and leaves the window at most once.";
  }
  if (q.tags.includes("binary-search")) {
    return "If the answer space is monotonic — every value below the answer fails and every value above passes — you can binary search the answer itself, not just a sorted array. The hard part is proving the predicate is monotonic and picking the right boundary.";
  }
  if (q.tags.includes("dp")) {
    return "The naive recursion solves the same subproblems over and over. Cache them, and the exponential tree collapses into a table. Start by asking: what smaller question would answer the original one?";
  }
  if (q.tags.includes("hashmap") || q.tags.includes("hashset")) {
    return "We’re doing a lookup in a loop. Pre-load the data into a hash map and turn that lookup into O(1). The pattern is almost always: build the map in one pass, then answer the question in a second.";
  }
  if (q.tags.includes("stack")) {
    return "Some problems are about nesting, undoing, or matching. A stack gives you a clean way to remember ‘what I saw most recently’ and resolve it when you meet its partner.";
  }
  if (q.tags.includes("linked-list")) {
    return "Linked-list problems usually reduce to three pointer moves: advance, reverse, or split. Add a dummy head whenever removal at the front is possible — it saves five lines of edge-case code.";
  }
  if (q.tags.includes("tree") || q.tags.includes("bst")) {
    return "Trees are naturally recursive. For any node, ask: what do I need from the left subtree, what do I need from the right, and what do I return to my parent? The answer to the whole problem is often the answer at the root.";
  }
  if (q.tags.includes("backtracking")) {
    return "Think of it as exploring a decision tree: make a choice, recurse, then undo the choice. The template is choose → explore → unchoose. The trick is learning what state to undo and when to prune.";
  }
  if (q.tags.includes("greedy")) {
    return "Greedy works when a locally best choice is always part of some globally optimal solution. If you can prove that by an exchange argument — replace any optimal solution’s first choice with the greedy one without making it worse — greedy is safe.";
  }
  if (q.tags.includes("heap")) {
    return "Whenever you need the smallest or largest of a dynamic set, a heap gives O(log n) access. The classic use cases are top-k and merging sorted streams.";
  }
  if (q.tags.includes("graph") || q.tags.includes("bfs") || q.tags.includes("dfs")) {
    return "Graph problems are traversal problems in disguise. Ask: do I care about shortest paths (BFS), connectivity/cycles (DFS), or union queries (Union-Find)? Pick the traversal that answers the question directly.";
  }
  if (q.tags.includes("bits")) {
    return "Bits let you encode state cheaply. XOR cancels duplicates, AND isolates bits, shifts move them. The O(1) tricks show up when the problem has a symmetry or a small alphabet of states.";
  }
  return "Before jumping to the optimal solution, ask what the brute force would do and where it wastes work. The efficient algorithm is usually the one that exploits a hidden invariant in the input.";
}

function Section({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section>
      {eyebrow && (
        <SectionLabel eyebrow={eyebrow}>{title}</SectionLabel>
      )}
      {!eyebrow && <h2 className="mb-3 text-[15px] font-semibold tracking-tight md:text-[16px]">{title}</h2>}
      {children}
    </section>
  );
}

function SectionLabel({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {eyebrow && (
        <span className="tabular font-mono text-[10px] font-semibold text-[color:var(--accent)]">
          {eyebrow}
        </span>
      )}
      <span className="h-px flex-1 bg-[color:var(--border-subtle)]" />
    </div>
  );
}

function StatusSegmented({
  value,
  onChange,
}: {
  value: "not_started" | "revisited" | "confident";
  onChange: (s: "not_started" | "revisited" | "confident") => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Mark your status"
      className="inline-flex items-center rounded-full border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-1"
    >
      {STATUS_ORDER.map((s) => {
        const active = value === s;
        return (
          <button
            key={s}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(s)}
            className={`relative rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
              active
                ? statusTextColor(s)
                : "text-muted hover:text-[color:var(--text-primary)]"
            }`}
          >
            {active && (
              <motion.span
                layoutId="status-pill"
                className={`absolute inset-0 rounded-full ${statusBgColor(s)}`}
                transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
              />
            )}
            <span className="relative z-10">{PROGRESS_LABELS[s]}</span>
          </button>
        );
      })}
    </div>
  );
}

function statusBgColor(s: "not_started" | "revisited" | "confident") {
  return s === "confident"
    ? "bg-[color:var(--status-confident)]/20"
    : s === "revisited"
    ? "bg-[color:var(--status-revisited)]/20"
    : "bg-[color:var(--surface-4)]";
}
function statusTextColor(s: "not_started" | "revisited" | "confident") {
  return s === "confident"
    ? "text-[color:var(--status-confident)]"
    : s === "revisited"
    ? "text-[color:var(--status-revisited)]"
    : "text-[color:var(--text-primary)]";
}

function ComplexityCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted md:text-[10.5px]">{label}</div>
      <div className="tabular mt-2 font-mono text-[14px] font-semibold text-[color:var(--accent)] md:text-[15px]">
        {value}
      </div>
    </div>
  );
}

function difficultyColor(d: "Easy" | "Medium" | "Hard") {
  return d === "Easy"
    ? "text-[color:var(--diff-easy)]"
    : d === "Medium"
    ? "text-[color:var(--diff-medium)]"
    : "text-[color:var(--diff-hard)]";
}

function DifficultyDot({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const color =
    difficulty === "Easy"
      ? "var(--diff-easy)"
      : difficulty === "Medium"
      ? "var(--diff-medium)"
      : "var(--diff-hard)";
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ background: color }}
      aria-hidden
    />
  );
}
