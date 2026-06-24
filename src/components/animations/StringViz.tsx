"use client";

import { useMemo } from "react";
import type { AnimationStep, CellState } from "@/data/types";
import {
  AnimatedCell,
  AnimatedPointer,
  AnimatedWindow,
  POINTER_LABEL_DY_STAGGER,
  POINTER_TRIANGLE_H,
  solveLabelLayout,
} from "./primitives";

interface StringVizProps {
  step: AnimationStep;
  data: string;
  label: string;
  prevStep: AnimationStep | undefined;
}

/** Tunables — smaller than ArrayViz because chars are denser. */
const CELL_GAP = 4;
const MIN_CELL_W = 22;
const MAX_CELL_W = 36;
const CELL_H = 44;
const FONT_SIZE = 16;
const INDEX_FONT_SIZE = 9;
const TRIANGLE_W = 12;

export default function StringViz({ step, data, label, prevStep }: StringVizProps) {
  const chars = useMemo(() => data.split(""), [data]);
  const pointers = step.highlights?.pointers ?? [];
  const cellStates = step.highlights?.cellStates ?? [];
  const matchedSet = new Set(step.highlights?.cells ?? []);
  const window = step.highlights?.window;

  const stateByIndex = new Map<number, CellState>();
  for (const cs of cellStates) stateByIndex.set(cs.index, cs.state);
  for (const i of matchedSet) if (!stateByIndex.has(i)) stateByIndex.set(i, "matched");
  if (window) {
    for (let i = window[0]; i < window[1]; i++) {
      if (!stateByIndex.has(i)) stateByIndex.set(i, "in-window");
    }
  }
  for (const p of pointers) {
    if (!stateByIndex.has(p.index)) stateByIndex.set(p.index, "active");
  }
  const prevStateByIndex = usePrevCellStates(prevStep);

  // Dynamic cell width: shrink for long strings so 13+ chars fit.
  // Container target width = 540 (the typical viz column width).
  const targetW = 540;
  const cW = Math.max(
    MIN_CELL_W,
    Math.min(MAX_CELL_W, Math.floor((targetW - 24) / chars.length - CELL_GAP)),
  );
  const X0 = 12;
  const rowY = 56;
  const triangleTopY = rowY - POINTER_TRIANGLE_H - 18;
  const windowLabelY = rowY + CELL_H + 30;
  const totalW = chars.length * (cW + CELL_GAP) - CELL_GAP + 24;
  const svgH = windowLabelY + 12;

  const layout = useMemo(
    () => solveLabelLayout(pointers, X0, cW, CELL_GAP, X0 + totalW - 24),
    [pointers, cW, totalW],
  );

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
          {window && (
            <AnimatedWindow
              start={window[0]}
              end={window[1]}
              cellX0={X0}
              cellW={cW}
              cellGap={CELL_GAP}
              rowY={rowY}
              cellH={CELL_H}
            />
          )}

          {chars.map((c, i) => {
            const x = X0 + i * (cW + CELL_GAP);
            const state = stateByIndex.get(i) ?? "default";
            const prevState = prevStateByIndex.get(i) ?? "default";
            return (
              <AnimatedCell
                key={i}
                x={x}
                y={rowY}
                w={cW}
                h={CELL_H}
                value={c}
                state={state}
                prevState={prevState}
                indexLabel={i}
                fontSize={FONT_SIZE}
                indexFontSize={INDEX_FONT_SIZE}
              />
            );
          })}

          {pointers.map((p) => {
            const layoutFor = layout.get(p.name) ?? { dx: 0, dy: 0 };
            return (
              <AnimatedPointer
                key={p.name}
                pointer={p}
                prevIndex={prevIndexByName.get(p.name)}
                cellX0={X0}
                cellW={cW}
                cellGap={CELL_GAP}
                triangleTopY={triangleTopY}
                rowY={rowY}
                labelDx={layoutFor.dx}
                labelDy={layoutFor.dy}
              />
            );
          })}

          {window && window[1] > window[0] && (
            <text
              x={
                X0 +
                ((window[0] + window[1] - 1) / 2) * (cW + CELL_GAP) +
                cW / 2
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

// Suppress unused-warning on the re-export.
export { POINTER_LABEL_DY_STAGGER };
