"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TOPICS } from "@/data/topics";
import { QUESTIONS } from "@/data/questions";
import { useProgress } from "@/context/ProgressContext";
import type { Progress } from "@/data/types";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { progress } = useProgress();

  const activeTopicId = pathname?.match(/\/topic\/([^\/]+)/)?.[1] ?? null;
  const activeQuestionId = pathname?.match(/\/topic\/[^\/]+\/question\/([^\/]+)/)?.[1] ?? null;

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-2)] text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--surface-3)] hover:text-[color:var(--text-primary)] active:scale-95"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[min(320px,85vw)] overflow-y-auto border-l border-[color:var(--border-subtle)] bg-[color:var(--surface-1)] p-4 pt-16 shadow-2xl"
            >
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="mb-4 block rounded-lg bg-[color:var(--surface-2)] p-3 text-[13.5px] font-semibold text-[color:var(--text-primary)]"
              >
                ← Dashboard
              </Link>

              <div className="space-y-1">
                {TOPICS.map((t) => {
                  const topicQs = QUESTIONS.filter((q) => q.topicId === t.id);
                  const isActive = activeTopicId === t.id;
                  return (
                    <div key={t.id}>
                      <Link
                        href={`/topic/${t.id}`}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-[13.5px] transition-colors ${
                          isActive
                            ? "bg-[color:var(--surface-3)] text-[color:var(--text-primary)]"
                            : "text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-2)]"
                        }`}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[color:var(--surface-3)] font-mono text-[10.5px] text-[color:var(--accent)]">
                          {t.icon}
                        </span>
                        <span className="flex-1 truncate">{t.shortName}</span>
                        <span className="tabular text-[10.5px] text-muted">{topicQs.length}</span>
                      </Link>

                      {isActive && (
                        <div className="ml-5 mt-1 space-y-0.5 border-l border-[color:var(--border-subtle)] pl-2.5 pb-2"
                        >
                          {topicQs.map((q) => {
                            const status: Progress = progress[q.id] ?? "not_started";
                            const isQ = activeQuestionId === q.id;
                            return (
                              <Link
                                key={q.id}
                                href={`/topic/${t.id}/question/${q.id}`}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-2 rounded px-2 py-1.5 text-[12.5px] transition-colors ${
                                  isQ
                                    ? "bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]"
                                    : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                                }`}
                              >
                                <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotForStatus(status)}`} />
                                <span className="flex-1 truncate">{q.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function dotForStatus(s: Progress) {
  return s === "confident"
    ? "bg-[color:var(--status-confident)]"
    : s === "revisited"
    ? "bg-[color:var(--status-revisited)]"
    : "bg-[color:var(--status-not-started)]";
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
