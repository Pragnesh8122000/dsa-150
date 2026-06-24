"use client";

import Link from "next/link";
import { PATTERNS } from "@/data/patterns";
import CollapsibleStation from "./CollapsibleStation";

interface PatternStationProps {
  patternFamily: string;
  questionTags: string[];
}

export default function PatternStation({ patternFamily, questionTags }: PatternStationProps) {
  const pattern = PATTERNS.find((p) =>
    p.tagMatchers.some((tag) => questionTags.includes(tag))
  );

  return (
    <CollapsibleStation
      id="pattern"
      eyebrow="Pattern"
      title={`This is a ${patternFamily} problem in disguise`}
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      }
    >
      <p className="prose-col text-[13.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[14px]">
        Once you recognize the {patternFamily} structure, the rest is bookkeeping. The same
        invariant and pointer/window logic transfers to other {patternFamily.toLowerCase()} problems — only the
        shape of the data changes.
      </p>

      {pattern && (
        <Link
          href={`/?pattern=${pattern.id}`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-1)] px-3 py-2 text-[12.5px] font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--surface-3)]"
        >
          <span className="text-[color:var(--accent)]">{pattern.icon}</span>
          <span>More {pattern.name} questions</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </CollapsibleStation>
  );
}
