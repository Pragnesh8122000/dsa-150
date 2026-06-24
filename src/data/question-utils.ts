import type { Question, AnimationStep } from "./types";

function stub(q: Omit<Question, "buildTrace" | "sampleInput"> & Partial<Pick<Question, "intuition" | "pitfalls" | "complexityReasoning" | "patternFamily" | "selfTest" | "interviewFraming">>): Question {
  return {
    ...q,
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
  };
}

export { stub };
