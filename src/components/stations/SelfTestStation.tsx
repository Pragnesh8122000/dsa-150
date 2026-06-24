"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SelfTestStep } from "@/data/types";
import CollapsibleStation from "./CollapsibleStation";

interface SelfTestStationProps {
  steps: SelfTestStep[];
}

export default function SelfTestStation({ steps }: SelfTestStationProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const step = steps[index];

  return (
    <CollapsibleStation
      id="self-test"
      eyebrow="Self-test"
      title="Predict the next step"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      }
    >
      <div className="mb-3 flex items-center justify-between text-[11px] text-muted">
        <span className="tabular">Question {index + 1} / {steps.length}</span>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-[color:var(--accent)]" : "w-1.5 bg-[color:var(--surface-4)]"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-1)] p-4 md:p-5">
        <p className="prose-col text-[14px] leading-[1.7] text-[color:var(--text-primary)] md:text-[14.5px]">
          {step.prompt}
        </p>

        <AnimatePresence mode="wait">
          {revealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-[color:var(--border-subtle)] pt-4">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--accent)]">
                  Answer
                </div>
                <p className="prose-col text-[13.5px] leading-[1.7] text-[color:var(--text-primary)] md:text-[14px]">
                  {step.answer}
                </p>
                {step.hint && (
                  <p className="prose-col mt-3 text-[12.5px] italic text-muted">
                    Hint: {step.hint}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center gap-2">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-[12.5px] font-semibold text-[color:var(--surface-0)] transition-colors hover:bg-[color:var(--accent-hover)] active:scale-95"
            >
              Reveal answer
            </button>
          ) : (
            <button
              onClick={() => {
                setRevealed(false);
                setIndex((i) => (i + 1) % steps.length);
              }}
              className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-2)] px-4 py-2 text-[12.5px] font-semibold text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--surface-3)] active:scale-95"
            >
              Next question
            </button>
          )}
        </div>
      </div>
    </CollapsibleStation>
  );
}
