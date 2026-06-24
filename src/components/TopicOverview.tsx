"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Topic, Question, Difficulty, Progress } from "@/data/types";
import { TOPIC_BY_ID } from "@/data/topics";
import { QUESTIONS } from "@/data/questions";
import { useProgress } from "@/context/ProgressContext";

interface TopicOverviewProps {
  topicId: string;
}

export default function TopicOverview({ topicId }: TopicOverviewProps) {
  const topic = TOPIC_BY_ID[topicId];
  const questions = QUESTIONS.filter((q) => q.topicId === topicId);
  const { progress } = useProgress();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [progressFilter, setProgressFilter] = useState<Progress | "All">("All");
  const [hideCompleted, setHideCompleted] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions.filter((it) => {
      const status = progress[it.id] ?? "not_started";
      if (difficulty !== "All" && it.difficulty !== difficulty) return false;
      if (progressFilter !== "All" && status !== progressFilter) return false;
      if (hideCompleted && status === "confident") return false;
      if (q && !it.title.toLowerCase().includes(q) && !it.tags.some((t) => t.includes(q)))
        return false;
      return true;
    });
  }, [query, difficulty, progressFilter, hideCompleted, questions, progress]);

  const stats = useMemo(() => {
    return {
      total: questions.length,
      confident: questions.filter((q) => progress[q.id] === "confident").length,
      revisited: questions.filter((q) => progress[q.id] === "revisited").length,
    };
  }, [questions, progress]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-14">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-8 md:mb-10"
      >
        <div className="mb-4 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[color:var(--accent-soft)] font-mono text-[20px] text-[color:var(--accent)] ring-1 ring-[color:var(--accent)]/25">
            {topic.icon}
          </span>
          <div>
            <h1 className="text-balance text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[30px]">
              {topic.name}
            </h1>
            <div className="mt-2 tabular text-[12px] text-muted">
              <span className="text-[color:var(--status-confident)]">{stats.confident}</span> confident
              <span className="mx-1.5 text-[color:var(--text-tertiary)]">·</span>
              <span className="text-[color:var(--status-revisited)]">{stats.revisited}</span> revisited
              <span className="mx-1.5 text-[color:var(--text-tertiary)]">·</span>
              <span>{stats.total} total</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Refresher */}
      <section className="mb-8 md:mb-10">
        <SectionLabel eyebrow="01">Refresher</SectionLabel>
        <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-5 md:p-6">
          <p className="prose-col text-[14.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[15px]">
            {topic.refresher}
          </p>
          {topic.keyPatterns.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t border-[color:var(--border-subtle)] pt-4">
              <span className="mr-1 self-center text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
                Key patterns
              </span>
              {topic.keyPatterns.map((p) => (
                <span
                  key={p}
                  className="rounded border border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] px-2.5 py-0.5 text-[11.5px] text-[color:var(--text-secondary)]"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Diagram (if any) */}
      {topic.diagram && (
        <section className="mb-8 md:mb-10">
          <SectionLabel eyebrow="02">Structure</SectionLabel>
          <figure className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-5 md:p-6">
            <div
              className="overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: topic.diagram }}
              aria-label={`Diagram illustrating the structure of ${topic.shortName.toLowerCase()}`}
            />
          </figure>
        </section>
      )}

      {/* Sorting complexity table */}
      {topic.complexityTable && (
        <section className="mb-8 md:mb-10">
          <SectionLabel eyebrow="03">Complexity comparison</SectionLabel>
          <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)]">
            <table className="w-full text-[13px] md:text-[13.5px]">
              <thead>
                <tr className="border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
                  <th className="px-4 py-3 font-semibold md:px-5">Algorithm</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Time</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Space</th>
                  <th className="px-4 py-3 font-semibold md:px-5">Notes</th>
                </tr>
              </thead>
              <tbody>
                {topic.complexityTable.map((r, i) => (
                  <tr
                    key={r.name}
                    className={`border-b border-[color:var(--border-subtle)] last:border-b-0 ${
                      i % 2 === 0 ? "" : "bg-[color:var(--surface-1)]/40"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium md:px-5">{r.name}</td>
                    <td className="px-4 py-3 font-mono text-[12.5px] tabular text-[color:var(--accent)] md:text-[13px]">{r.time}</td>
                    <td className="px-4 py-3 font-mono text-[12.5px] tabular text-[color:var(--accent)] md:text-[13px]">{r.space}</td>
                    <td className="px-4 py-3 text-muted md:px-5">{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Question list */}
      <section>
        <div className="mb-5 flex items-baseline justify-between">
          <SectionLabel eyebrow="04">Questions</SectionLabel>
          <span className="tabular text-[11.5px] text-muted">
            {filtered.length} of {stats.total}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px] md:min-w-[240px]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="question-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              aria-label="Search questions"
              className="w-full rounded-md border border-[color:var(--border-default)] bg-[color:var(--surface-1)] py-2 pl-9 pr-3 text-[13px] outline-none placeholder:text-[color:var(--text-tertiary)] transition-colors focus:border-[color:var(--accent)] md:text-[13.5px]"
            />
          </div>
          <FilterSelect value={difficulty} onChange={(v) => setDifficulty(v as Difficulty | "All")} label="Difficulty">
            <option value="All">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </FilterSelect>
          <FilterSelect value={progressFilter} onChange={(v) => setProgressFilter(v as Progress | "All")} label="Status">
            <option value="All">All statuses</option>
            <option value="not_started">Not started</option>
            <option value="revisited">Revisited</option>
            <option value="confident">Confident</option>
          </FilterSelect>
          <button
            onClick={() => setHideCompleted((v) => !v)}
            aria-pressed={hideCompleted}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-medium transition-colors ${
              hideCompleted
                ? "border-[color:var(--accent)]/40 bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                : "border-[color:var(--border-default)] bg-[color:var(--surface-1)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              {hideCompleted && <path d="m9 12 2 2 4-4" />}
            </svg>
            Hide done
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)]">
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-[13.5px] text-muted">
              No questions match your filters.
            </div>
          )}
          {filtered.map((q, idx) => {
            const status: Progress = progress[q.id] ?? "not_started";
            return (
              <Link
                key={q.id}
                href={`/topic/${topic.id}/question/${q.id}`}
                className={`group flex w-full items-center gap-3.5 border-b border-[color:var(--border-subtle)] px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-[color:var(--surface-3)] active:scale-[0.998] md:px-5 ${
                  idx === 0 ? "" : ""
                }`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                    status === "confident"
                      ? "bg-[color:var(--status-confident)]"
                      : status === "revisited"
                      ? "bg-[color:var(--status-revisited)]"
                      : "bg-[color:var(--status-not-started)]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-medium md:text-[14px]">{q.title}</div>
                  <div className="mt-0.5 truncate text-[11px] text-muted md:text-[11.5px]">{q.tags.slice(0, 4).join(" · ")}</div>
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold tabular md:text-[10.5px] ${
                    q.difficulty === "Easy"
                      ? "text-[color:var(--diff-easy)]"
                      : q.difficulty === "Medium"
                      ? "text-[color:var(--diff-medium)]"
                      : "text-[color:var(--diff-hard)]"
                  }`}
                  style={{
                    background:
                      q.difficulty === "Easy"
                        ? "color-mix(in srgb, var(--diff-easy) 12%, transparent)"
                        : q.difficulty === "Medium"
                        ? "color-mix(in srgb, var(--diff-medium) 12%, transparent)"
                        : "color-mix(in srgb, var(--diff-hard) 12%, transparent)",
                  }}
                >
                  {q.difficulty}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
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
      <h2 className="text-[14px] font-semibold tracking-tight md:text-[15px]">{children}</h2>
      <span className="h-px flex-1 bg-[color:var(--border-subtle)]" />
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-md border border-[color:var(--border-default)] bg-[color:var(--surface-1)] py-1.5 pl-3 pr-8 text-[12px] outline-none transition-colors focus:border-[color:var(--accent)]"
      >
        {children}
      </select>
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
        aria-hidden
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}
