"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TOPICS } from "@/data/topics";
import { QUESTIONS } from "@/data/questions";
import { useProgress } from "@/context/ProgressContext";
import { useCodeMode } from "@/hooks/useCodeMode";
import type { Progress } from "@/data/types";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { progress, stats } = useProgress();
  const { codeMode } = useCodeMode();

  const activeTopicId = deriveActiveTopicId(pathname);
  const activeQuestionId = deriveActiveQuestionId(pathname);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop sidebar — hidden in code workspace mode */}
      <aside className={`hidden h-full w-80 shrink-0 flex-col border-r border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] md:flex ${codeMode ? "md:hidden" : ""}`}>
        <Brand />

        {/* Progress */}
        <div className="border-b border-[color:var(--border-subtle)] p-5">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
              Your progress
            </span>
            <span className="tabular text-[11.5px] text-muted">
              {stats.confident + stats.revisited}/{QUESTIONS.length}
            </span>
          </div>
          <div className="flex h-1.5 overflow-hidden rounded-full bg-[color:var(--surface-3)]">
            <motion.div
              className="bg-[color:var(--status-confident)]"
              animate={{ width: `${(stats.confident / QUESTIONS.length) * 100}%` }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
            <motion.div
              className="bg-[color:var(--status-revisited)]"
              animate={{ width: `${(stats.revisited / QUESTIONS.length) * 100}%` }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11.5px] text-muted tabular">
            <span><Dot color="var(--status-confident)" /> {stats.confident} confident</span>
            <span><Dot color="var(--status-revisited)" /> {stats.revisited} revisited</span>
            <span className="text-[color:var(--text-tertiary)]">{QUESTIONS.length - stats.confident - stats.revisited} left</span>
          </div>
        </div>

        {/* Topic list */}
        <nav className="flex-1 overflow-y-auto py-3">
          {TOPICS.map((t) => {
            const topicQs = QUESTIONS.filter((q) => q.topicId === t.id);
            const done = topicQs.filter((q) => progress[q.id] === "confident").length;
            const revisited = topicQs.filter((q) => progress[q.id] === "revisited").length;
            const isActive = activeTopicId === t.id;

            return (
              <div key={t.id} className="relative px-2.5 py-0.5">
                {isActive && (
                  <motion.span
                    layoutId="topic-active-pill"
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-[color:var(--accent)]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <Link
                  href={`/topic/${t.id}`}
                  className={`relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13.5px] transition-colors ${
                    isActive
                      ? "bg-[color:var(--surface-3)] text-[color:var(--text-primary)]"
                      : "text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-2)] hover:text-[color:var(--text-primary)]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[10.5px] transition-colors ${
                      isActive
                        ? "bg-[color:var(--accent)] text-[color:var(--surface-0)]"
                        : "bg-[color:var(--surface-3)] text-muted"
                    }`}
                  >
                    {t.icon}
                  </span>
                  <span className="flex-1 truncate font-medium">{t.shortName}</span>
                  <span className="tabular text-[10.5px] text-muted">
                    {done + revisited > 0 ? `${done + revisited}/${topicQs.length}` : topicQs.length}
                  </span>
                </Link>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="qlist"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="ml-5 mt-1.5 space-y-0.5 border-l border-[color:var(--border-subtle)] pl-2.5 pb-1.5">
                        {topicQs.map((q, idx) => {
                          const status: Progress = progress[q.id] ?? "not_started";
                          const isQ = activeQuestionId === q.id;
                          return (
                            <motion.div
                              key={q.id}
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.18, delay: Math.min(idx * 0.012, 0.18) }}
                            >
                              <Link
                                href={`/topic/${t.id}/question/${q.id}`}
                                className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[12.5px] transition-colors ${
                                  isQ
                                    ? "bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]"
                                    : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                                }`}
                              >
                                <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotForStatus(status)}`} />
                                <span className={`flex-1 truncate ${isQ ? "font-medium" : ""}`}>{q.title}</span>
                                <span className={`text-[10px] font-semibold tabular ${badgeForDifficulty(q.difficulty)}`}>
                                  {q.difficulty[0]}
                                </span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-[color:var(--border-subtle)] px-5 py-3.5 text-[10.5px] leading-relaxed text-muted">
          <span className="font-medium text-[color:var(--text-secondary)]">Tip</span>{" "}
          In a question, press <Kbd>Space</Kbd> to play and <Kbd>←</Kbd>/<Kbd>→</Kbd> to step.
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

function deriveActiveTopicId(pathname: string | null): string | null {
  if (!pathname) return null;
  const match = pathname.match(/\/topic\/([^\/]+)/);
  return match?.[1] ?? null;
}

function deriveActiveQuestionId(pathname: string | null): string | null {
  if (!pathname) return null;
  const match = pathname.match(/\/topic\/[^\/]+\/question\/([^\/]+)/);
  return match?.[1] ?? null;
}

function Brand() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-5 py-5 text-left transition-colors hover:bg-[color:var(--surface-2)]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--accent-soft)] text-[color:var(--accent)] ring-1 ring-[color:var(--accent)]/20 transition-transform group-hover:scale-[1.04]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      </div>
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold tracking-[-0.01em]">DSA Revision Hub</div>
        <div className="text-[11.5px] text-muted">Interview prep · top 150</div>
      </div>
    </Link>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
      style={{ background: color }}
    />
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded border border-[color:var(--border-default)] bg-[color:var(--surface-3)] px-1 font-mono text-[10px] text-[color:var(--text-secondary)]">
      {children}
    </kbd>
  );
}

function dotForStatus(s: Progress) {
  return s === "confident"
    ? "bg-[color:var(--status-confident)]"
    : s === "revisited"
    ? "bg-[color:var(--status-revisited)]"
    : "bg-[color:var(--status-not-started)]";
}

function badgeForDifficulty(d: "Easy" | "Medium" | "Hard") {
  return d === "Easy"
    ? "text-[color:var(--diff-easy)]"
    : d === "Medium"
    ? "text-[color:var(--diff-medium)]"
    : "text-[color:var(--diff-hard)]";
}
