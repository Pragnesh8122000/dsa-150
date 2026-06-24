"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { CellState } from "@/data/types";

/**
 * Returns a transition object that respects the user's reduced-motion
 * preference. Spring transitions collapse to instant.
 */
export function useReducedMotionTransition() {
  const reduced = useReducedMotion();
  if (reduced) return { duration: 0.01 } as const;
  return { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 };
}

/** Geometry constants shared across visualizations. */
export const CELL_W = 52;
export const CELL_H = 52;
export const CELL_GAP = 6;
export const POINTER_TRIANGLE_H = 12; // triangle height above the stem
export const POINTER_LABEL_DY = -2;  // default label offset above triangle
export const POINTER_LABEL_DY_STAGGER = -16; // offset when label is bumped up to avoid collision
export const LABEL_W = 28;
export const LABEL_MIN_GAP = 6;
export const POINTER_TRIANGLE_W = 14;
export const STEM_DROP = 4;

// ─── Pointer label collision ─────────────────────────────────────────────────

export interface PointerSpec {
  name: string;
  index: number;
  color?: string;
}

export interface LabelOffset {
  /** Horizontal pixel offset applied to the label's text (relative to triangle center). */
  dx: number;
  /** Vertical pixel offset applied to the label's text (relative to default position). */
  dy: number;
}

/**
 * Greedy left-to-right pass that pushes overlapping pointer labels apart
 * horizontally. If a label cannot fit horizontally (would overflow canvas),
 * it's bumped up vertically (dy = POINTER_LABEL_DY_STAGGER).
 *
 * Returns a Map from pointer name to its label offset.
 */
export function solveLabelLayout(
  pointers: PointerSpec[],
  cellX0: number,
  cellW: number,
  cellGap: number,
  canvasRight: number,
): Map<string, LabelOffset> {
  const out = new Map<string, LabelOffset>();
  if (pointers.length === 0) return out;

  const sorted = [...pointers].sort((a, b) => a.index - b.index);
  let cursor = -Infinity;
  for (const p of sorted) {
    const cx = cellX0 + p.index * (cellW + cellGap) + cellW / 2;
    const placed = Math.max(cx, cursor + LABEL_W / 2 + LABEL_MIN_GAP);
    let dx = placed - cx;
    let dy = 0;
    if (placed + LABEL_W / 2 > canvasRight - 4) {
      dx = 0;
      dy = POINTER_LABEL_DY_STAGGER;
    }
    out.set(p.name, { dx, dy });
    cursor = placed + LABEL_W / 2;
  }
  return out;
}

// ─── AnimatedPointer ─────────────────────────────────────────────────────────

interface AnimatedPointerProps {
  pointer: PointerSpec;
  /** Previous index, used to set the spring's starting position. */
  prevIndex: number | undefined;
  cellX0: number;
  cellW: number;
  cellGap: number;
  /** Y coordinate (in SVG units) where the triangle's top edge sits. */
  triangleTopY: number;
  /** Y coordinate (in SVG units) where the row of cells begins. */
  rowY: number;
  labelDx: number;
  labelDy: number;
  /** Optional label override (defaults to pointer.name). */
  label?: string;
}

/**
 * A pointer that slides between cell positions via Framer Motion spring.
 * Renders a triangle pointing down at the cell, a thin stem from the
 * triangle's tip into the cell, and a label above.
 */
export function AnimatedPointer({
  pointer,
  prevIndex,
  cellX0,
  cellW,
  cellGap,
  triangleTopY,
  rowY,
  labelDx,
  labelDy,
  label,
}: AnimatedPointerProps) {
  const cx = cellX0 + pointer.index * (cellW + cellGap) + cellW / 2;
  const color = pointer.color ?? "var(--state-active)";

  // Seed the spring with prevIndex so the first animation after a step
  // change tweens from the previous cell, not from (0, 0).
  const groupRef = useRef<SVGGElement>(null);
  const prevCx =
    prevIndex !== undefined
      ? cellX0 + prevIndex * (cellW + cellGap) + cellW / 2
      : cx;
  const initialDx = prevIndex !== undefined ? prevCx - cx : 0;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.setAttribute("transform", `translate(${initialDx}, 0)`);
    }
    // Intentionally only run on pointer identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointer.name, prevIndex]);

  const triCx = cx;
  const triTopY = triangleTopY;
  const triBottomY = triTopY + POINTER_TRIANGLE_H;
  const stemBottomY = rowY - 2;

  return (
    <g ref={groupRef}>
      <motion.g
        animate={{ x: -initialDx, opacity: 1 }}
        transition={useReducedMotionTransition()}
      >
        {/* Triangle pointing down at the cell */}
        <motion.polygon
          points={`${triCx - POINTER_TRIANGLE_W / 2},${triTopY} ${triCx + POINTER_TRIANGLE_W / 2},${triTopY} ${triCx},${triBottomY}`}
          fill={color}
          animate={{ fill: color }}
          transition={{ duration: 0.18 }}
        />
        {/* Stem from triangle tip down to the cell row */}
        <motion.line
          x1={triCx}
          x2={triCx}
          animate={{ y1: triBottomY, y2: stemBottomY, stroke: color }}
          transition={{ duration: 0.18 }}
          strokeWidth={1.5}
          strokeOpacity={0.55}
        />
        {/* Label */}
        <motion.text
          animate={{ x: labelDx, y: labelDy, fill: color }}
          initial={false}
          transition={{ duration: 0.2 }}
          x={triCx}
          y={triTopY + POINTER_LABEL_DY}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill={color}
          fontFamily="var(--font-mono)"
        >
          {label ?? pointer.name}
        </motion.text>
      </motion.g>
    </g>
  );
}

// ─── AnimatedCell ────────────────────────────────────────────────────────────

const LOUD_STATES: ReadonlySet<CellState> = new Set([
  "in-window",
  "matched",
  "active",
  "rejected",
  "comparing",
]);

interface AnimatedCellProps {
  x: number;
  y: number;
  w: number;
  h: number;
  /** The value displayed inside the cell. */
  value: React.ReactNode;
  /** Cell state — drives fill, stroke, and entry pulse. */
  state: CellState;
  /** Previous state — pulse fires only when entering a loud state. */
  prevState: CellState;
  /** Index label drawn below the cell (optional). */
  indexLabel?: React.ReactNode;
  /** Font size for the value text. */
  fontSize?: number;
  /** Font size for the index label. */
  indexFontSize?: number;
  /** Override fill/stroke colors. */
  fillOverride?: string;
  strokeOverride?: string;
}

/**
 * Renders a rounded rect cell with a value label and an optional index
 * label. Plays a brief scale pulse when the state transitions into a
 * "loud" set (matched, active, rejected, in-window, comparing).
 */
export function AnimatedCell({
  x,
  y,
  w,
  h,
  value,
  state,
  prevState,
  indexLabel,
  fontSize = 17,
  indexFontSize = 10,
  fillOverride,
  strokeOverride,
}: AnimatedCellProps) {
  const isLoud = LOUD_STATES.has(state);
  const wasLoud = LOUD_STATES.has(prevState);
  const pulse = isLoud && state !== prevState;

  // Stable fill/stroke per state. Reading from CSS variables keeps the
  // palette in lockstep with globals.css.
  const fill =
    fillOverride ??
    (state === "matched"
      ? "var(--state-considered-soft)"
      : state === "active"
      ? "var(--state-window)"
      : state === "rejected"
      ? "var(--state-rejected-soft)"
      : state === "in-window"
      ? "transparent"
      : "var(--surface-2)");
  const stroke =
    strokeOverride ??
    (state === "matched"
      ? "var(--state-considered)"
      : state === "active"
      ? "var(--state-active)"
      : state === "rejected"
      ? "var(--state-rejected)"
      : state === "in-window"
      ? "transparent"
      : "var(--border-default)");

  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
        animate={{ fill, stroke, scale: pulse ? [1, 1.08, 1] : 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 5}
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily="var(--font-mono)"
        fontWeight={500}
        fill="var(--text-primary)"
      >
        {value}
      </text>
      {indexLabel !== undefined && (
        <text
          x={x + w / 2}
          y={y + h + 14}
          textAnchor="middle"
          fontSize={indexFontSize}
          fill="var(--text-tertiary)"
          fontFamily="var(--font-mono)"
        >
          {indexLabel}
        </text>
      )}
    </g>
  );
}

// ─── AnimatedWindow ──────────────────────────────────────────────────────────

interface AnimatedWindowProps {
  /** Inclusive start index of the window. */
  start: number;
  /** Exclusive end index of the window. */
  end: number;
  cellX0: number;
  cellW: number;
  cellGap: number;
  rowY: number;
  cellH: number;
}

/**
 * Translucent window highlight that slides its edges between step
 * transitions instead of remounting. Includes small bracket marks at
 * each edge to make the window boundaries unambiguous.
 */
export function AnimatedWindow({
  start,
  end,
  cellX0,
  cellW,
  cellGap,
  rowY,
  cellH,
}: AnimatedWindowProps) {
  const x = cellX0 + start * (cellW + cellGap) - 3;
  const w = Math.max(0, (end - start) * (cellW + cellGap) + 6);
  const visible = end > start;

  return (
    <motion.g
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.rect
        animate={{ x, width: w }}
        transition={useReducedMotionTransition()}
        y={rowY - 2}
        height={cellH + 4}
        rx={8}
        fill="var(--state-window)"
        stroke="var(--state-active)"
        strokeWidth={1.5}
      />
      {/* Bracket marks at each edge */}
      <motion.line
        animate={{ x1: x, x2: x, opacity: visible ? 1 : 0 }}
        transition={useReducedMotionTransition()}
        y1={rowY - 6}
        y2={rowY + cellH + 6}
        stroke="var(--state-active)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <motion.line
        animate={{ x1: x + w, x2: x + w, opacity: visible ? 1 : 0 }}
        transition={useReducedMotionTransition()}
        y1={rowY - 6}
        y2={rowY + cellH + 6}
        stroke="var(--state-active)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </motion.g>
  );
}

// ─── Bar (bar-chart primitive) ───────────────────────────────────────────────

interface BarProps {
  x: number;
  baseY: number;
  w: number;
  /** Target height in SVG units. */
  h: number;
  value: React.ReactNode;
  isHighlighted: boolean;
  labelDx?: number;
}

/**
 * Single bar for the bar-chart visualization (Container With Most Water).
 * Bar grows upward from baseY. Height and y animate via Framer when the
 * value changes between steps.
 */
export function Bar({ x, baseY, w, h, value, isHighlighted, labelDx = 0 }: BarProps) {
  const safeH = Math.max(2, h); // 2px min so zero values stay visible
  const y = baseY - safeH;
  return (
    <g>
      <motion.rect
        x={x}
        animate={{ y, height: safeH }}
        transition={useReducedMotionTransition()}
        width={w}
        rx={3}
        fill={isHighlighted ? "var(--state-considered-soft)" : "var(--state-bar-soft)"}
        stroke={isHighlighted ? "var(--state-considered)" : "var(--state-bar-stroke)"}
        strokeWidth={isHighlighted ? 2 : 1.25}
      />
      <motion.text
        animate={{ y: baseY + 14 }}
        initial={false}
        x={x + w / 2 + labelDx}
        textAnchor="middle"
        fontSize={11}
        fontFamily="var(--font-mono)"
        fontWeight={500}
        fill="var(--text-primary)"
      >
        {value}
      </motion.text>
      <motion.text
        animate={{ y: baseY + 28 }}
        initial={false}
        x={x + w / 2 + labelDx}
        textAnchor="middle"
        fontSize={9}
        fill="var(--text-tertiary)"
        fontFamily="var(--font-mono)"
      >
        {/* Index label is added by the parent as part of value composition */}
      </motion.text>
    </g>
  );
}
