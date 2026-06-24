"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Progress } from "@/data/types";

const PROGRESS_KEY = "dsa-revisor-progress-v1";
const VISITED_KEY = "dsa-revisor-visited-v1";
const FIRST_VISIT_KEY = "dsa-revisor-first-visit";

type ProgressMap = Record<string, Progress>;
type VisitedMap = Record<string, number>;

interface ProgressContextValue {
  progress: ProgressMap;
  setStatus: (questionId: string, status: Progress) => void;
  cycleStatus: (questionId: string) => Progress;
  reset: () => void;
  /** Record that a question was just opened. */
  visit: (questionId: string) => void;
  /** Timestamp (ms) of the last time each question was opened. */
  visitedAt: VisitedMap;
  /** True if this is the first session (no persisted progress). */
  isFirstVisit: boolean;
  stats: {
    not_started: number;
    revisited: number;
    confident: number;
    total: number;
  };
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const ORDER: Progress[] = ["not_started", "revisited", "confident"];

function loadMap<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, T>;
    }
  } catch {
    /* ignore corrupt storage */
  }
  return {};
}

function saveMap(key: string, map: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(map));
  } catch {
    /* ignore storage errors */
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [visitedAt, setVisitedAt] = useState<VisitedMap>({});
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on the client.
  useEffect(() => {
    setProgress(loadMap(PROGRESS_KEY));
    setVisitedAt(loadMap(VISITED_KEY));
    const first =
      typeof window !== "undefined"
        ? window.localStorage.getItem(FIRST_VISIT_KEY) !== "false"
        : true;
    setIsFirstVisit(first);
    if (typeof window !== "undefined" && first) {
      window.localStorage.setItem(FIRST_VISIT_KEY, "false");
    }
    setHydrated(true);
  }, []);

  // Persist whenever progress changes after hydration.
  useEffect(() => {
    if (!hydrated) return;
    saveMap(PROGRESS_KEY, progress);
  }, [progress, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveMap(VISITED_KEY, visitedAt);
  }, [visitedAt, hydrated]);

  const setStatus = useCallback((questionId: string, status: Progress) => {
    setProgress((prev) => ({ ...prev, [questionId]: status }));
  }, []);

  const cycleStatus = useCallback((questionId: string): Progress => {
    let next: Progress = "not_started";
    setProgress((prev) => {
      const cur: Progress = prev[questionId] ?? "not_started";
      next = ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length];
      return { ...prev, [questionId]: next };
    });
    return next;
  }, []);

  const reset = useCallback(() => {
    setProgress({});
    setVisitedAt({});
    saveMap(PROGRESS_KEY, {});
    saveMap(VISITED_KEY, {});
  }, []);

  const visit = useCallback((questionId: string) => {
    const now = Date.now();
    setVisitedAt((prev) => ({ ...prev, [questionId]: now }));
  }, []);

  const stats = Object.values(progress).reduce(
    (acc, s) => {
      acc[s] += 1;
      acc.total += 1;
      return acc;
    },
    { not_started: 0, revisited: 0, confident: 0, total: 0 }
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setStatus,
        cycleStatus,
        reset,
        visit,
        visitedAt,
        isFirstVisit,
        stats,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

export const PROGRESS_LABELS: Record<Progress, string> = {
  not_started: "Not started",
  revisited: "Revisited",
  confident: "Confident",
};

export const PROGRESS_COLORS: Record<Progress, string> = {
  not_started: "bg-zinc-700 text-zinc-300",
  revisited: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  confident: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
};
