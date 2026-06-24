"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONS } from "@/data/questions";
import { TOPICS } from "@/data/topics";
import { PATTERNS } from "@/data/patterns";

type ResultType = "question" | "topic" | "pattern";

interface Result {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
}

const MAX_QUESTIONS = 6;
const MAX_TOPICS = 3;
const MAX_PATTERNS = 3;

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Toggle on Cmd/Ctrl + K; close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input when opening.
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];

    const matchesQuestion = QUESTIONS.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, MAX_QUESTIONS);

    const matchesTopic = TOPICS.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.shortName.toLowerCase().includes(q) ||
        it.keyPatterns.some((p) => p.toLowerCase().includes(q))
    ).slice(0, MAX_TOPICS);

    const matchesPattern = PATTERNS.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.shortName.toLowerCase().includes(q) ||
        it.blurb.toLowerCase().includes(q)
    ).slice(0, MAX_PATTERNS);

    const topicCounts: Record<string, number> = {};
    for (const qn of QUESTIONS) {
      topicCounts[qn.topicId] = (topicCounts[qn.topicId] ?? 0) + 1;
    }

    const out: Result[] = [];
    for (const it of matchesQuestion) {
      out.push({
        id: it.id,
        type: "question",
        title: it.title,
        subtitle: TOPICS.find((t) => t.id === it.topicId)?.shortName ?? it.topicId,
        href: `/topic/${it.topicId}/question/${it.id}`,
        icon: it.difficulty[0],
      });
    }
    for (const it of matchesTopic) {
      out.push({
        id: it.id,
        type: "topic",
        title: it.name,
        subtitle: `${topicCounts[it.id] ?? 0} questions`,
        href: `/topic/${it.id}`,
        icon: it.icon,
      });
    }
    for (const it of matchesPattern) {
      out.push({
        id: it.id,
        type: "pattern",
        title: it.name,
        subtitle: it.blurb,
        href: `/?pattern=${it.id}`,
        icon: it.icon,
      });
    }
    return out;
  }, [q]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  useEffect(() => {
    if (!open) return;
    const onNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(results.length - 1, s + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(0, s - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = results[selected];
        if (r) navigate(r.href);
      }
    };
    window.addEventListener("keydown", onNav);
    return () => window.removeEventListener("keydown", onNav);
  }, [open, results, selected, navigate]);

  // Keep selected in bounds when results change.
  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, results.length - 1)));
  }, [results.length]);

  // Scroll selected item into view.
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${selected}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  return (
    <>
      {/* Desktop trigger */}
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-full border border-[color:var(--border-default)] bg-[color:var(--surface-2)] px-3 py-1.5 text-[12px] text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)] md:inline-flex"
        aria-label="Open search"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        Search
        <kbd className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded border border-[color:var(--border-default)] bg-[color:var(--surface-1)] px-1 font-mono text-[10px] text-[color:var(--text-tertiary)]">
          ⌘K
        </kbd>
      </button>

      {/* Mobile icon-only trigger */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border-default)] bg-[color:var(--surface-2)] text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)] md:hidden"
        aria-label="Open search"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              className="fixed left-1/2 top-[12vh] z-[80] w-[min(640px,calc(100vw-24px))] -translate-x-1/2 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] shadow-2xl"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-4 py-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions, topics, or patterns…"
                  className="flex-1 bg-transparent text-[15px] text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-tertiary)]"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="rounded border border-[color:var(--border-default)] bg-[color:var(--surface-1)] px-2 py-1 text-[11px] text-muted transition-colors hover:text-[color:var(--text-primary)]"
                >
                  Esc
                </button>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
                {query.trim() === "" && (
                  <div className="px-3 py-6 text-center text-[13px] text-muted">
                    Start typing to find questions, topics, or patterns.
                  </div>
                )}

                {query.trim() !== "" && results.length === 0 && (
                  <div className="px-3 py-6 text-center text-[13px] text-muted">
                    No matches for “{query.trim()}”.
                  </div>
                )}

                {results.map((r, i) => {
                  const isSelected = i === selected;
                  return (
                    <button
                      key={`${r.type}-${r.id}`}
                      data-index={i}
                      onClick={() => navigate(r.href)}
                      onMouseEnter={() => setSelected(i)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        isSelected ? "bg-[color:var(--accent-soft)]" : "hover:bg-[color:var(--surface-3)]"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-[12px] ${
                          r.type === "question"
                            ? "bg-[color:var(--surface-3)] text-[color:var(--accent)]"
                            : "bg-[color:var(--surface-3)] text-[color:var(--text-secondary)]"
                        }`}
                      >
                        {r.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-medium text-[color:var(--text-primary)]">{r.title}</div>
                        <div className="truncate text-[12px] text-muted">
                          <span className="mr-1.5 rounded bg-[color:var(--surface-3)] px-1 py-0.5 text-[10px]">
                            {r.type === "question" && "Question"}
                            {r.type === "topic" && "Topic"}
                            {r.type === "pattern" && "Pattern"}
                          </span>
                          {r.subtitle}
                        </div>
                      </div>
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[color:var(--accent)]">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[color:var(--border-subtle)] px-4 py-2 text-[11px] text-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Kbd>↑</Kbd> <Kbd>↓</Kbd> to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <Kbd>↵</Kbd> to open
                  </span>
                </div>
                <span>{results.length} results</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-4 min-w-4 items-center justify-center rounded border border-[color:var(--border-default)] bg-[color:var(--surface-1)] px-1 font-mono text-[10px]">
      {children}
    </kbd>
  );
}
