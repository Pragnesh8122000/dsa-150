"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "dsa-revisor-last-path";

export function useLastVisited() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === "/") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, pathname);
    } catch {
      /* ignore */
    }
  }, [pathname]);
}

export function getLastVisitedPath(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
