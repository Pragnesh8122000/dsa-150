"use client";

import CollapsibleStation from "./CollapsibleStation";

interface ComplexityStationProps {
  timeComplexity: string;
  spaceComplexity: string;
  reasoning: string;
}

export default function ComplexityStation({
  timeComplexity,
  spaceComplexity,
  reasoning,
}: ComplexityStationProps) {
  return (
    <CollapsibleStation
      id="complexity"
      eyebrow="Complexity"
      title="Why the bounds work"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      }
    >
      <p className="prose-col mb-5 text-[13.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[14px]">
        {reasoning}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-1)] p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted md:text-[10.5px]">Time</div>
          <div className="tabular mt-2 font-mono text-[15px] font-semibold text-[color:var(--accent)]">{timeComplexity}</div>
        </div>
        <div className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-1)] p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted md:text-[10.5px]">Space</div>
          <div className="tabular mt-2 font-mono text-[15px] font-semibold text-[color:var(--accent)]">{spaceComplexity}</div>
        </div>
      </div>
    </CollapsibleStation>
  );
}
