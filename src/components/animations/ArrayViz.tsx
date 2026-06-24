"use client";

import { useMemo, useRef } from "react";
import type { AnimationStep, CellState } from "@/data/types";
import {
  AnimatedCell,
  AnimatedPointer,
  AnimatedWindow,
  CELL_GAP,
  CELL_H,
  CELL_W,
  POINTER_LABEL_DY_STAGGER,
  POINTER_TRIANGLE_H,
  solveLabelLayout,
} from "./primitives";

interface ArrayVizProps {
  step: AnimationStep;
  data: number[];
  label: string;
  /** Previous step — used to compute pointer prevIndex so pointers spring
   *  between positions instead of teleporting. */
  prevStep: AnimationStep | undefined;
}

/**
 * Number-array visualization. Two rows of rectangular cells with sliding
 * pointers above. Suitable for two-pointer, sliding-window, prefix-sum, etc.
 */
export default function ArrayViz({ step, data, label, prevStep }: ArrayVizProps) {
  const pointers = step.highlights?.pointers ?? [];
  const cellStates = step.highlights?.cellStates ?? [];
  // Back-compat: indices in `cells` are interpreted as "matched" state.
  const matchedSet = new Set(step.highlights?.cells ?? []);
  const window = step.highlights?.window;

  // Per-cell state resolution.
  const stateByIndex = new Map<number, CellState>();
  for (const cs of cellStates) stateByIndex.set(cs.index, cs.state);
  for (const i of matchedSet) if (!stateByIndex.has(i)) stateByIndex.set(i, "matched");
  if (window) {
    for (let i = window[0]; i < window[1]; i++) {
      if (!stateByIndex.has(i)) stateByIndex.set(i, "in-window");
    }
  }
  // Cells pointed at by any pointer default to "active" if not otherwise set.
  for (const p of pointers) {
    if (!stateByIndex.has(p.index)) stateByIndex.set(p.index, "active");
  }

  const prevStateByIndex = usePrevCellStates(prevStep);

  const X0 = 12;
  const rowY = 56;
  const triangleTopY = rowY - POINTER_TRIANGLE_H - 22;
  const windowLabelY = rowY + CELL_H + 32;
  const totalW = data.length * (CELL_W + CELL_GAP) - CELL_GAP + 24;
  const svgH = windowLabelY + 12;

  // Solve pointer-label collisions.
  const layout = useMemo(
    () => solveLabelLayout(pointers, X0, CELL_W, CELL_GAP, X0 + totalW - 24),
    [pointers, totalW],
  );

  // Map prevStep pointer (same name) → its index.
  const prevIndexByName = useMemo(() => {
    const m = new Map<string, number>();
    if (prevStep?.highlights?.pointers) {
      for (const p of prevStep.highlights.pointers) m.set(p.name, p.index);
    }
    return m;
  }, [prevStep]);

  return (
    <div className="relative">
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalW} ${svgH}`}
          width="100%"
          className="block"
          preserveAspectRatio="xMinYMid meet"
        >
          {/* Window highlight */}
          {window && (
            <AnimatedWindow
              start={window[0]}
              end={window[1]}
              cellX0={X0}
              cellW={CELL_W}
              cellGap={CELL_GAP}
              rowY={rowY}
              cellH={CELL_H}
            />
          )}

          {/* Cells */}
          {data.map((v, i) => {
            const x = X0 + i * (CELL_W + CELL_GAP);
            const state = stateByIndex.get(i) ?? "default";
            const prevState = prevStateByIndex.get(i) ?? "default";
            return (
              <AnimatedCell
                key={i}
                x={x}
                y={rowY}
                w={CELL_W}
                h={CELL_H}
                value={v}
                state={state}
                prevState={prevState}
                indexLabel={i}
              />
            );
          })}

          {/* Pointers */}
          {pointers.map((p) => {
            const layoutFor = layout.get(p.name) ?? { dx: 0, dy: 0 };
            return (
              <AnimatedPointer
                key={p.name}
                pointer={p}
                prevIndex={prevIndexByName.get(p.name)}
                cellX0={X0}
                cellW={CELL_W}
                cellGap={CELL_GAP}
                triangleTopY={triangleTopY}
                rowY={rowY}
                labelDx={layoutFor.dx}
                labelDy={layoutFor.dy}
              />
            );
          })}

          {/* Window label below */}
          {window && window[1] > window[0] && (
            <text
              x={
                X0 +
                ((window[0] + window[1] - 1) / 2) * (CELL_W + CELL_GAP) +
                CELL_W / 2
              }
              y={windowLabelY}
              textAnchor="middle"
              fontSize={10}
              fill="var(--state-active)"
              fontFamily="var(--font-mono)"
            >
              window [{window[0]}, {window[1]})
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}

/**
 * Compute the per-cell state map for the previous step so AnimatedCell
 * can decide whether to fire an entry pulse.
 */
function usePrevCellStates(prevStep: AnimationStep | undefined): Map<number, CellState> {
  const prev = prevStep?.highlights;
  return useMemo(() => {
    const m = new Map<number, CellState>();
    if (!prev) return m;
    const matchedSet = new Set(prev.cells ?? []);
    for (const cs of prev.cellStates ?? []) m.set(cs.index, cs.state);
    for (const i of matchedSet) if (!m.has(i)) m.set(i, "matched");
    if (prev.window) {
      for (let i = prev.window[0]; i < prev.window[1]; i++) {
        if (!m.has(i)) m.set(i, "in-window");
      }
    }
    for (const p of prev.pointers ?? []) {
      if (!m.has(p.index)) m.set(p.index, "active");
    }
    return m;
  }, [prevStep]);
}

// Re-export so consumers can pull geometry constants too.
export { CELL_W, CELL_H, CELL_GAP, POINTER_TRIANGLE_H, POINTER_LABEL_DY_STAGGER };
