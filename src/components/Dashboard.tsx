"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { TOPICS } from "@/data/topics";
import { QUESTIONS, QUESTION_BY_ID } from "@/data/questions";
import { PATTERNS, PATTERN_BY_ID } from "@/data/patterns";
import { useProgress } from "@/context/ProgressContext";
import { getLastVisitedPath } from "@/hooks/useLastVisited";
import type { Question, Progress } from "@/data/types";
import Onboarding from "./Onboarding";

type Tab = "continue" | "pattern" | "topic";

export default function Dashboard() {
  const { progress, stats, visitedAt } = useProgress();
  const searchParams = useSearchParams();
  const selectedPatternId = searchParams.get("pattern");
  const selectedPattern = selectedPatternId ? PATTERN_BY_ID[selectedPatternId] ?? null : null;

  const [tab, setTab] = useState<Tab>(selectedPattern ? "pattern" : "continue");
  const [lastPath, setLastPath] = useState<string | null>(null);

  useEffect(() => {
    setLastPath(getLastVisitedPath());
  }, []);

  useEffect(() => {
    if (selectedPattern) setTab("pattern");
  }, [selectedPattern]);

  const lastQuestion = useMemo(() => {
    if (!lastPath) return null;
    const match = lastPath.match(/\/topic\/[^/]+\/question\/([^/]+)/);
    if (!match) return null;
    return QUESTION_BY_ID[match[1]] ?? null;
  }, [lastPath]);

  const reps = useMemo(() => suggestReps(progress, visitedAt), [progress, visitedAt]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-14">
      <Onboarding />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-10 md:mb-14"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--border-default)] bg-[color:var(--surface-2)] px-3.5 py-1.5 text-[11px] font-medium text-[color:var(--text-secondary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          Beginner-friendly · Big-tech interview focused
        </div>
        <h1 className="text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[40px]">
          Master the 150 questions that{" "}
          <span className="text-[color:var(--accent)]">actually show up</span>{" "}
          in interviews.
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-muted md:text-[15.5px]">
          No CS degree required. Every problem explains{" "}
          <em>why</em> the pattern works, walks through a real example,
          gives you runnable JavaScript, and shows a step-by-step animation
          you can pause and rewind.
        </p>
      </motion.section>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-3 md:mb-14 md:grid-cols-4 md:gap-4">
        <Stat label="Topics" value={TOPICS.length.toString()} />
        <Stat label="Questions" value={QUESTIONS.length.toString()} />
        <Stat label="Confident" value={stats.confident.toString()} accent="text-[color:var(--status-confident)]" />
        <Stat label="Revisited" value={stats.revisited.toString()} accent="text-[color:var(--status-revisited)]" />
      </div>

      <BeginnerPath />

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 rounded-full border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-1 md:mb-8">
        <TabBtn active={tab === "continue"} onClick={() => setTab("continue")}>
          Continue
        </TabBtn>
        <TabBtn active={tab === "pattern"} onClick={() => setTab("pattern")}>
          By pattern
        </TabBtn>
        <TabBtn active={tab === "topic"} onClick={() => setTab("topic")}>
          By topic
        </TabBtn>
      </div>

      {/* Tab content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tab === "continue" && (
          <ContinueTab lastQuestion={lastQuestion} reps={reps} />
        )}
        {tab === "pattern" && (
          selectedPattern ? (
            <PatternQuestions pattern={selectedPattern} />
          ) : (
            <PatternTab />
          )
        )}
        {tab === "topic" && <TopicTab />}
      </motion.div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors md:text-[13px] ${
        active ? "text-[color:var(--text-primary)]" : "text-muted hover:text-[color:var(--text-primary)]"
      }`}
    >
      {active && (
        <motion.span
          layoutId="dashboard-tab"
          className="absolute inset-0 rounded-full bg-[color:var(--surface-3)]"
          transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function ContinueTab({
  lastQuestion,
  reps,
}: {
  lastQuestion: Question | null;
  reps: Question[];
}) {
  return (
    <div className="space-y-8">
      {lastQuestion && (
        <section>
          <SectionHeader title="Resume where you left off" />
          <Link
            href={`/topic/${lastQuestion.topicId}/question/${lastQuestion.id}`}
            className="group block rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-5 transition-colors hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-3)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                {TOPICS.find((t) => t.id === lastQuestion.topicId)?.shortName}
              </span>
              <DifficultyBadge difficulty={lastQuestion.difficulty} />
            </div>
            <div className="text-[17px] font-semibold leading-snug">{lastQuestion.title}</div>
            <div className="mt-3 flex items-center gap-2 text-[12px] text-[color:var(--accent)]">
              <span>Continue learning</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </section>
      )}

      <section>
        <SectionHeader title="Today's reps" subtitle="A short mixed set to keep patterns fresh." />
        {reps.length === 0 ? (
          <p className="text-[13.5px] text-muted">No questions ready yet — pick a pattern or topic to start.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reps.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PatternTab() {
  const { progress } = useProgress();

  return (
    <section>
      <SectionHeader title="By pattern" subtitle="Study by the technique, not the topic. This is how interviews think." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PATTERNS.map((p, i) => {
          const questions = QUESTIONS.filter((q) =>
            p.tagMatchers.some((tag) => q.tags.includes(tag))
          );
          const done = questions.filter((q) => progress[q.id] === "confident").length;
          const revisited = questions.filter((q) => progress[q.id] === "revisited").length;
          const pct = questions.length === 0 ? 0 : ((done + revisited) / questions.length) * 100;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
            >
              <Link
                href={`/?pattern=${p.id}`}
                className="group block h-full rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-5 transition-colors hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-3)]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--surface-3)] font-mono text-[16px] text-[color:var(--accent)] ring-1 ring-[color:var(--border-subtle)] transition-colors group-hover:bg-[color:var(--accent-soft)]">
                    {p.icon}
                  </span>
                  <span className="tabular text-[10.5px] text-muted">
                    {done + revisited > 0 ? `${done + revisited}/${questions.length}` : `${questions.length} q`}
                  </span>
                </div>
                <div className="text-[15px] font-semibold leading-snug">{p.name}</div>
                <div className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted">{p.blurb}</div>
                {done + revisited > 0 && (
                  <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-[color:var(--surface-1)]">
                    <div className="h-full bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function PatternQuestions({ pattern }: { pattern: import("@/data/patterns").Pattern }) {
  const { progress } = useProgress();
  const questions = useMemo(
    () => QUESTIONS.filter((q) => pattern.tagMatchers.some((tag) => q.tags.includes(tag))),
    [pattern]
  );

  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1 text-[12.5px] text-muted transition-colors hover:text-[color:var(--text-primary)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          All patterns
        </Link>
      </div>
      <SectionHeader title={pattern.name} subtitle={pattern.blurb} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {questions.map((q, i) => (
          <QuestionCard key={q.id} question={q} index={i} />
        ))}
      </div>
    </section>
  );
}

function TopicTab() {
  const { progress } = useProgress();

  return (
    <section>
      <SectionHeader title="By topic" subtitle="The classic textbook order, with a progress bar per chapter." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t, i) => {
          const topicQs = QUESTIONS.filter((q) => q.topicId === t.id);
          const done = topicQs.filter((q) => progress[q.id] === "confident").length;
          const revisited = topicQs.filter((q) => progress[q.id] === "revisited").length;
          const total = topicQs.length;
          const pct = total === 0 ? 0 : ((done + revisited) / total) * 100;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
            >
              <Link
                href={`/topic/${t.id}`}
                className="group block h-full rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-5 transition-colors hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-3)]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--surface-3)] font-mono text-[16px] text-[color:var(--accent)] ring-1 ring-[color:var(--border-subtle)] transition-colors group-hover:bg-[color:var(--accent-soft)]">
                    {t.icon}
                  </span>
                  <span className="tabular text-[10.5px] text-muted">
                    {done + revisited > 0 ? `${done + revisited}/${total}` : `${total} q`}
                  </span>
                </div>
                <div className="text-[15px] font-semibold leading-snug">{t.name}</div>
                <div className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted">{t.blurb}</div>
                {done + revisited > 0 && (
                  <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-[color:var(--surface-1)]">
                    <div className="h-full bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function QuestionCard({ question, index }: { question: Question; index: number }) {
  const { progress } = useProgress();
  const status: Progress = progress[question.id] ?? "not_started";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Link
        href={`/topic/${question.topicId}/question/${question.id}`}
        className="group flex h-full flex-col rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-4 transition-colors hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-3)]"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
            {TOPICS.find((t) => t.id === question.topicId)?.shortName}
          </span>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>
        <div className="flex-1 text-[14px] font-medium leading-snug">{question.title}</div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotForStatus(status)}`} />
          <span>{statusLabel(status)}</span>
        </div>
      </Link>
    </motion.div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-4 md:p-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</div>
      <div className={`tabular mt-2 text-[26px] font-semibold leading-none tracking-tight md:text-[30px] ${accent ?? "text-[color:var(--text-primary)]"}`}>
        {value}
      </div>
    </div>
  );
}

function BeginnerPath() {
  const { progress } = useProgress();
  const steps = [
    { id: "arrays", label: "Arrays & Strings", why: "Warm up with the basics" },
    { id: "hashing", label: "Hashing", why: "Learn the frequency-map superpower" },
    { id: "two-pointers", label: "Two Pointers", why: "Turn O(n²) into O(n)" },
  ];

  return (
    <section className="mb-10 md:mb-14">
      <SectionHeader title="Beginner path" subtitle="A recommended order if you're starting from scratch." />
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => {
          const topic = TOPICS.find((t) => t.id === s.id)!;
          const qs = QUESTIONS.filter((q) => q.topicId === s.id);
          const done = qs.filter((q) => progress[q.id] === "confident").length;
          const active = done < qs.length;
          return (
            <Link
              key={s.id}
              href={active ? `/topic/${s.id}` : `/topic/${s.id}`}
              className="group relative flex items-center gap-3 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-4 transition-colors hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-3)]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--surface-3)] font-mono text-[13px] text-[color:var(--accent)] ring-1 ring-[color:var(--border-subtle)]">
                {topic.icon}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold">{topic.shortName}</span>
                  {!active && (
                    <span className="rounded bg-[color:var(--status-confident)]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--status-confident)]">Done</span>
                  )}
                </div>
                <div className="text-[12px] text-muted">{s.why}</div>
              </div>
              <span className="ml-auto tabular text-[11px] text-muted">
                {done}/{qs.length}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{title}</h2>
      {subtitle && <p className="mt-1.5 text-[13px] text-muted">{subtitle}</p>}
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const color =
    difficulty === "Easy"
      ? "var(--diff-easy)"
      : difficulty === "Medium"
      ? "var(--diff-medium)"
      : "var(--diff-hard)";
  return (
    <span
      className="rounded px-2 py-0.5 text-[10px] font-semibold tabular"
      style={{
        color,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
      }}
    >
      {difficulty}
    </span>
  );
}

function dotForStatus(s: Progress) {
  return s === "confident"
    ? "bg-[color:var(--status-confident)]"
    : s === "revisited"
    ? "bg-[color:var(--status-revisited)]"
    : "bg-[color:var(--status-not-started)]";
}

function statusLabel(s: Progress) {
  return s === "confident" ? "Confident" : s === "revisited" ? "Needs review" : "Not started";
}

function suggestReps(
  progress: Record<string, Progress>,
  visitedAt: Record<string, number>
): Question[] {
  const now = Date.now();

  const buckets: Record<Progress, Question[]> = {
    not_started: [],
    revisited: [],
    confident: [],
  };
  for (const q of QUESTIONS) {
    const s = progress[q.id] ?? "not_started";
    buckets[s].push(q);
  }

  // Sort each bucket by least-recently visited first, then by difficulty (Easy → Hard).
  const byRecency = (a: Question, b: Question) => {
    const ta = visitedAt[a.id] ?? 0;
    const tb = visitedAt[b.id] ?? 0;
    if (ta !== tb) return ta - tb;
    const diffOrder = { Easy: 0, Medium: 1, Hard: 2 };
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  };

  const revisited = buckets.revisited.filter((q) => {
    const last = visitedAt[q.id] ?? 0;
    return now - last > 4 * 60 * 60 * 1000; // older than 4 hours
  }).sort(byRecency);

  const notStarted = buckets.not_started.sort(byRecency);
  const confident = buckets.confident.sort(byRecency);

  const picks: Question[] = [];
  const seen = new Set<string>();
  const add = (q: Question | undefined) => {
    if (!q || seen.has(q.id)) return;
    seen.add(q.id);
    picks.push(q);
  };

  // Prioritize spaced review, then new material, then older confident reviews.
  add(revisited[0]);
  add(notStarted[0]);
  add(revisited[1]);
  add(notStarted[1]);
  if (picks.length < 3) add(confident[0]);
  if (picks.length < 3) add(revisited[2] ?? notStarted[2]);

  return picks.slice(0, 3);
}
