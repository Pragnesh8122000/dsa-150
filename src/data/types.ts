export type Difficulty = "Easy" | "Medium" | "Hard";

export type Progress = "not_started" | "revisited" | "confident";

/** How a question should be rendered in the animation canvas. */
export type VizMode = "array" | "string" | "bar" | "none";

/** Per-cell state for animations. `"default"` is the resting state. */
export type CellState = "default" | "in-window" | "matched" | "active" | "rejected" | "comparing";

export interface AnimationStep {
  /** Human readable description of what is happening in this step. */
  description: string;
  /** Variables snapshot to display in the variables panel. */
  variables: Record<string, string | number | string[] | number[] | null>;
  /** Optional highlight indices (array contexts). */
  highlights?: {
    pointers?: { name: string; index: number; color?: string }[];
    /** Back-compat: indices treated as `state: "matched"`. */
    cells?: number[];
    /** Per-cell state overrides. Takes precedence over `cells`. */
    cellStates?: { index: number; state: CellState }[];
    window?: [number, number];
  };
  /** For tree/graph animations. */
  nodes?: { id: string; state: "default" | "active" | "visited" | "in-window" | "match" }[];
  /** For DP table animations. */
  dpCells?: { row: number; col: number; value: number; state: "default" | "computing" | "filled" | "match" }[];
  /** Code line to highlight (1-indexed). */
  codeLine?: number;
}

export interface Pitfall {
  /** Short label shown in the pitfall list. */
  label: string;
  /** The actual explanation of the mistake and how to avoid it. */
  body: string;
}

export interface SelfTestStep {
  /** What the learner sees before revealing the answer. */
  prompt: string;
  /** The correct next step / answer. */
  answer: string;
  /** Optional hint if they get stuck. */
  hint?: string;
}

export interface Question {
  id: string;
  topicId: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  problem: string;
  constraints: string[];
  approach: string;
  dryRun: string[];
  solution: string; // JS code as string
  timeComplexity: string;
  spaceComplexity: string;
  /** Function that returns the step-by-step animation trace for a sample input. */
  buildTrace: () => AnimationStep[];
  /** Sample input displayed alongside the animation. */
  sampleInput: { label: string; value: string }[];
  /**
   * Renderer hint for the animation canvas.
   * Optional — the player derives a sensible default from `sampleInput`
   * (string literal → `string`, numeric array → `array`, otherwise `none`).
   * For bar-chart problems (e.g. "Container With Most Water"), set this
   * explicitly to `"bar"`.
   */
  vizMode?: VizMode;

  // ─── New learning stations (Phase 2) ──────────────────────────────────
  /** A short “why this idea exists” hook written before the mechanics. */
  intuition?: string;
  /** Common mistakes learners make on this specific problem. */
  pitfalls?: Pitfall[];
  /** A reasoning-first explanation of time/space complexity, not just the answer. */
  complexityReasoning?: string;
  /** The transferable pattern this problem belongs to. */
  patternFamily?: string;
  /** Active-recall prompts: predict the next step/output. */
  selfTest?: SelfTestStep[];
  /** How this question shows up in real interviews, with common follow-ups. */
  interviewFraming?: string;
}

export interface Topic {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  blurb: string;
  refresher: string;
  keyPatterns: string[];
  diagram?: string; // SVG markup
  complexityTable?: { name: string; time: string; space: string; notes: string }[];
}
