"use client";

import CollapsibleStation from "./CollapsibleStation";

interface InterviewStationProps {
  text: string;
}

export default function InterviewStation({ text }: InterviewStationProps) {
  return (
    <CollapsibleStation
      id="interview"
      eyebrow="Interview"
      title="How this shows up in interviews"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      }
    >
      <p className="prose-col text-[13.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[14px]">
        {text}
      </p>
    </CollapsibleStation>
  );
}
