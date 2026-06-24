"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Progress } from "@/data/types";

interface MobileBottomBarProps {
  topicId: string;
  questionId: string;
  status: Progress;
  onStatusChange: (s: Progress) => void;
  onMarkConfidentNext?: () => void;
  codeMode?: boolean;
  onToggleCodeMode?: () => void;
}

const STATUS_ORDER: Progress[] = ["not_started", "revisited", "confident"];
const SHORT_LABELS: Record<Progress, string> = {
  not_started: "Start",
  revisited: "Review",
  confident: "Done",
};

export default function MobileBottomBar({
  topicId,
  status,
  onStatusChange,
  onMarkConfidentNext,
  onToggleCodeMode,
}: MobileBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[color:var(--border-subtle)] bg-[color:var(--surface-1)]/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        {/* Back to topic — large thumb target */}
        <Link
          href={`/topic/${topicId}`}
          className="flex h-12 items-center gap-2 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] px-4 text-[13px] font-medium text-[color:var(--text-primary)] transition-colors active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Topic
        </Link>

        {/* Compact status segmented control */}
        <div
          role="radiogroup"
          aria-label="Mark your status"
          className="flex flex-1 items-center rounded-full border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-1"
        >
          {STATUS_ORDER.map((s) => {
            const active = status === s;
            return (
              <button
                key={s}
                role="radio"
                aria-checked={active}
                onClick={() => onStatusChange(s)}
                className={`relative flex-1 rounded-full py-2 text-[11px] font-semibold transition-colors ${
                  active ? statusTextColor(s) : "text-muted hover:text-[color:var(--text-primary)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-status-pill"
                    className={`absolute inset-0 rounded-full ${statusBgColor(s)}`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <StatusDot status={s} active={active} />
                  {SHORT_LABELS[s]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Code toggle */}
        <button
          onClick={onToggleCodeMode}
          aria-label="Open coding workspace"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)] active:scale-95 sm:w-auto sm:px-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 18 6-6-6-6" />
            <path d="m8 6-6 6 6 6" />
          </svg>
          <span className="ml-1.5 hidden text-[12px] font-medium sm:inline">Code</span>
        </button>

        {/* Done & next shortcut */}
        <button
          onClick={onMarkConfidentNext}
          disabled={!onMarkConfidentNext}
          aria-label="Mark confident and go to the next question"
          className="flex h-12 items-center gap-1.5 rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent-soft)] px-3 text-[12px] font-semibold text-[color:var(--accent)] transition-colors active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
        >
          <span className="hidden sm:inline">Done & next</span>
          <span className="sm:hidden">Next</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function StatusDot({ status, active }: { status: Progress; active: boolean }) {
  const color =
    status === "confident"
      ? "var(--status-confident)"
      : status === "revisited"
      ? "var(--status-revisited)"
      : active
      ? "var(--text-primary)"
      : "var(--text-tertiary)";
  return <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />;
}

function statusBgColor(s: Progress) {
  return s === "confident"
    ? "bg-[color:var(--status-confident)]/20"
    : s === "revisited"
    ? "bg-[color:var(--status-revisited)]/20"
    : "bg-[color:var(--surface-4)]";
}

function statusTextColor(s: Progress) {
  return s === "confident"
    ? "text-[color:var(--status-confident)]"
    : s === "revisited"
    ? "text-[color:var(--status-revisited)]"
    : "text-[color:var(--text-primary)]";
}
