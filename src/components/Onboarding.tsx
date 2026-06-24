"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";

const DISMISS_KEY = "dsa-revisor-welcome-dismissed";

export default function Onboarding() {
  const { isFirstVisit } = useProgress();
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === "true";
    setOpen(isFirstVisit && !dismissed);
  }, [isFirstVisit]);

  // Focus management + focus trap.
  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    const startBtn = startBtnRef.current;
    const t = setTimeout(() => {
      startBtn?.focus();
    }, 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modal) return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, "true");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            tabIndex={-1}
            className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-6 shadow-2xl outline-none md:p-8"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-[color:var(--accent)] ring-1 ring-[color:var(--accent)]/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 id="welcome-title" className="text-[20px] font-semibold tracking-[-0.02em] md:text-[22px]">
              Welcome to DSA Revision Hub
            </h2>
            <p className="mt-3 text-[14px] leading-[1.7] text-muted">
              You don’t need a CS degree to crack coding interviews. Every problem here is built around one idea:
              learn the pattern first, then watch it run step-by-step.
            </p>

            <ul className="mt-5 space-y-3 text-[13px] text-[color:var(--text-secondary)]">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[10px] font-semibold text-[color:var(--accent)]">1</span>
                Pick a topic or pattern from the dashboard.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[10px] font-semibold text-[color:var(--accent)]">2</span>
                Read the Spark, step through the animation, and try the self-test cards.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[10px] font-semibold text-[color:var(--accent)]">3</span>
                Mark questions as confident — we’ll surface them again for spaced review.
              </li>
            </ul>

            <div className="mt-7 flex flex-col gap-2.5">
              <Link
                ref={startBtnRef}
                href="/topic/arrays"
                onClick={dismiss}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-[13px] font-semibold text-[color:var(--surface-0)] transition-colors hover:bg-[color:var(--accent-hover)] active:scale-[0.98]"
              >
                Start beginner path
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <button
                onClick={dismiss}
                className="rounded-lg px-4 py-2 text-[13px] text-muted transition-colors hover:text-[color:var(--text-primary)]"
              >
                Continue without tour
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
