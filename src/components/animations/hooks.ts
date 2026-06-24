"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns the set of variable keys that "meaningfully" changed in the
 * current step vs. the previous one. Filters out incidental counters
 * (e.g. `right` incrementing every step of a sliding-window pass) so
 * the variable panel doesn't flash on every tick.
 *
 * Heuristic:
 *  - A key is material if its name matches a list of recognizable
 *    pointer / answer / window variable names.
 *  - For material keys, the value MUST also have changed (we don't
 *    re-flash a no-op reassignment).
 *  - For other keys (custom question-defined), we always include them
 *    so questions with bespoke state don't lose signals.
 */
const MATERIAL_KEY_RE =
  /(left|right|^l$|^r$|\bi$|\bj$|lo|hi|pointer|window|sum|len|best|count|have|required|action|removing|dropped|char|h_L|h_R|height_L|height_R|area|newBest|bestStart|bestEnd|bestLen|answer|windowStr|removingIdx)/i;

export function useMaterialVarChanges(
  vars: Record<string, unknown>,
): Set<string> {
  const prev = useRef<Record<string, unknown>>({});
  const [changed, setChanged] = useState<Set<string>>(new Set());

  useEffect(() => {
    const p = prev.current;
    const next = new Set<string>();
    for (const [k, v] of Object.entries(vars)) {
      if (p[k] === v) continue;
      if (MATERIAL_KEY_RE.test(k)) {
        next.add(k);
      } else {
        // Non-material key — still include so novel state is visible.
        next.add(k);
      }
    }
    // Also include keys that were in `prev` but removed this step.
    for (const k of Object.keys(p)) {
      if (!(k in vars)) next.add(k);
    }
    setChanged(next);
    prev.current = { ...vars };
    const t = setTimeout(() => setChanged(new Set()), 600);
    return () => clearTimeout(t);
  }, [vars]);

  return changed;
}
