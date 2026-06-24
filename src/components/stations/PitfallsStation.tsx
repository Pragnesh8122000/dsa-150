"use client";

import type { Pitfall } from "@/data/types";
import CollapsibleStation from "./CollapsibleStation";

interface PitfallsStationProps {
  pitfalls: Pitfall[];
}

export default function PitfallsStation({ pitfalls }: PitfallsStationProps) {
  return (
    <CollapsibleStation
      id="pitfalls"
      eyebrow="Pitfalls"
      title="Common mistakes"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="currentColor" />
          <path d="M12 9v5M12 17h.01" stroke="var(--surface-0)" />
        </svg>
      }
    >
      <ul className="space-y-4">
        {pitfalls.map((p, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--state-rejected-soft)] text-[11px] font-semibold text-[color:var(--state-rejected)]">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="mb-1 text-[13px] font-semibold text-[color:var(--text-primary)]">{p.label}</div>
              <p className="text-[13px] leading-[1.7] text-muted">{p.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </CollapsibleStation>
  );
}
