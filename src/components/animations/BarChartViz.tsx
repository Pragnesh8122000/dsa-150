"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { AnimationStep } from "@/data/types";
import {
  AnimatedPointer,
  Bar,
  POINTER_LABEL_DY_STAGGER,
  POINTER_TRIANGLE_H,
  solveLabelLayout,
  useReducedMotionTransition,
} from "./primitives";

interface BarChartVizProps {
  step: AnimationStep;
  data: number[];
  label: string;
  prevStep: AnimationStep | undefined;
}

const BAR_W = 44;
const BAR_GAP = 6;
const X0 = 12;
const CANVAS_H = 180;        // bar plotting area
const TOP_PAD = 56;          // space above the bars for pointers
const BOTTOM_PAD = 50;       // space below for value + index labels
const TRIANGLE_W = 14;

export default function BarChartViz({ step, data, label, prevStep }: BarChartVizProps) {
  const pointers = step.highlights?.pointers ?? [];
  const highlighted = new Set(step.highlights?.cells ?? []);

  const maxV = Math.max(...data, 1);
  const baseY = TOP_PAD + CANVAS_H;
  const totalW = data.length * (BAR_W + BAR_GAP) - BAR_GAP + 24;
  const svgH = baseY + BOTTOM_PAD;
  const triangleTopY = TOP_PAD - POINTER_TRIANGLE_H - 18;

  // Layout L/R pointers and find the candidate "water" area.
  const layout = useMemo(
    () => solveLabelLayout(pointers, X0, BAR_W, BAR_GAP, X0 + totalW - 24),
    [pointers, totalW],
  );
  const prevIndexByName = useMemo(() => {
    const m = new Map<string, number>();
    if (prevStep?.highlights?.pointers) {
      for (const p of prevStep.highlights.pointers) m.set(p.name, p.index);
    }
    return m;
  }, [prevStep]);

  const L = pointers.find((p) => p.name === "L");
  const R = pointers.find((p) => p.name === "R");
  const hasLR = L !== undefined && R !== undefined && L.index < R.index;
  const minH = hasLR ? Math.min(data[L!.index], data[R!.index]) : 0;
  const areaW = hasLR ? (R!.index - L!.index) * (BAR_W + BAR_GAP) : 0;
  const waterY = baseY - minH;
  const waterX = X0 + L!.index * (BAR_W + BAR_GAP);
  const area = hasLR ? minH * (R!.index - L!.index) : 0;

  return (
    <div className="relative">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
          {label}
        </span>
        {hasLR && (
          <motion.span
            key={`area-${area}`}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="tabular rounded border border-[color:var(--border-subtle)] bg-[color:var(--surface-3)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--accent)]"
          >
            area = {area}
          </motion.span>
        )}
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalW} ${svgH}`}
          width="100%"
          className="block"
          preserveAspectRatio="xMinYMid meet"
        >
          {/* Baseline */}
          <line
            x1={X0 - 4}
            x2={X0 + totalW - 24 + 4}
            y1={baseY + 1}
            y2={baseY + 1}
            stroke="var(--border-strong)"
            strokeWidth={1}
          />

          {/* Water rectangle between L and R, with edge brackets. */}
          {hasLR && (
            <motion.g
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.rect
                animate={{ x: waterX, y: waterY, width: areaW, height: minH }}
                transition={useReducedMotionTransition()}
                fill="var(--state-water)"
                stroke="var(--state-active)"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                rx={3}
              />
              {/* Brackets on each side */}
              <motion.line
                animate={{ x1: waterX, x2: waterX }}
                transition={useReducedMotionTransition()}
                y1={waterY - 6}
                y2={waterY + minH + 6}
                stroke="var(--state-active)"
                strokeWidth={2}
                strokeLinecap="round"
              />
              <motion.line
                animate={{ x1: waterX + areaW, x2: waterX + areaW }}
                transition={useReducedMotionTransition()}
                y1={waterY - 6}
                y2={waterY + minH + 6}
                stroke="var(--state-active)"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </motion.g>
          )}

          {/* Bars */}
          {data.map((v, i) => {
            const h = (v / maxV) * CANVAS_H;
            const x = X0 + i * (BAR_W + BAR_GAP);
            const isHL = highlighted.has(i);
            const isAtL = L?.index === i;
            const isAtR = R?.index === i;
            const labelDx =
              (isAtL ? -(layout.get("L")?.dx ?? 0) : 0) +
              (isAtR ? -(layout.get("R")?.dx ?? 0) : 0);
            return (
              <Bar
                key={i}
                x={x}
                baseY={baseY}
                w={BAR_W}
                h={h}
                value={v}
                isHighlighted={isHL || isAtL || isAtR}
                labelDx={labelDx}
              />
            );
          })}

          {/* Pointers */}
          {pointers.map((p) => {
            const off = layout.get(p.name) ?? { dx: 0, dy: 0 };
            return (
              <AnimatedPointer
                key={p.name}
                pointer={p}
                prevIndex={prevIndexByName.get(p.name)}
                cellX0={X0}
                cellW={BAR_W}
                cellGap={BAR_GAP}
                triangleTopY={triangleTopY}
                rowY={TOP_PAD}
                labelDx={off.dx}
                labelDy={off.dy}
              />
            );
          })}

          {/* Index axis */}
          {data.map((_, i) => (
            <text
              key={i}
              x={X0 + i * (BAR_W + BAR_GAP) + BAR_W / 2}
              y={baseY + 42}
              textAnchor="middle"
              fontSize={9}
              fill="var(--text-tertiary)"
              fontFamily="var(--font-mono)"
            >
              {i}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// Suppress unused-warning on the re-export.
export { POINTER_LABEL_DY_STAGGER, TRIANGLE_W };
