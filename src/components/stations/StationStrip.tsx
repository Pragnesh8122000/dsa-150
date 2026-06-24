"use client";
import type { Question } from "@/data/types";
import PitfallsStation from "./PitfallsStation";
import ComplexityStation from "./ComplexityStation";
import PatternStation from "./PatternStation";
import SelfTestStation from "./SelfTestStation";
import InterviewStation from "./InterviewStation";
import SolutionStation from "./SolutionStation";

interface StationStripProps {
  question: Question;
}

export default function StationStrip({ question }: StationStripProps) {
  const hasExtraStations =
    question.solution ||
    question.pitfalls ||
    question.complexityReasoning ||
    question.patternFamily ||
    question.selfTest ||
    question.interviewFraming;

  return (
    <div className="mt-8 space-y-4 md:mt-10">
      {/* Spark is always visible at the top of the page, not repeated here. */}

      {/* Desktop: vertical stack of collapsible stations */}
      <div className="hidden md:block">
        {hasExtraStations && (
          <div className="mb-4 flex items-center gap-2">
            <span className="tabular font-mono text-[10px] font-semibold text-[color:var(--accent)]">
              Stations
            </span>
            <span className="h-px flex-1 bg-[color:var(--border-subtle)]" />
          </div>
        )}

        <div className="space-y-3">
          {question.solution && <SolutionStation code={question.solution} />}
          {question.pitfalls && <PitfallsStation pitfalls={question.pitfalls} />}
          {question.complexityReasoning && (
            <ComplexityStation
              timeComplexity={question.timeComplexity}
              spaceComplexity={question.spaceComplexity}
              reasoning={question.complexityReasoning}
            />
          )}
          {question.patternFamily && <PatternStation patternFamily={question.patternFamily} questionTags={question.tags} />}
          {question.selfTest && <SelfTestStation steps={question.selfTest} />}
          {question.interviewFraming && <InterviewStation text={question.interviewFraming} />}
        </div>
      </div>

      {/* Mobile: horizontal swipeable cards */}
      <MobileStations question={question} />
    </div>
  );
}

function MobileStations({ question }: { question: Question }) {
  const cards: { key: string; node: React.ReactNode }[] = [];
  if (question.solution) {
    cards.push({
      key: "solution",
      node: <SolutionStation code={question.solution} />,
    });
  }
  if (question.pitfalls) {
    cards.push({
      key: "pitfalls",
      node: <PitfallsStation pitfalls={question.pitfalls} />,
    });
  }
  if (question.complexityReasoning) {
    cards.push({
      key: "complexity",
      node: (
        <ComplexityStation
          timeComplexity={question.timeComplexity}
          spaceComplexity={question.spaceComplexity}
          reasoning={question.complexityReasoning}
        />
      ),
    });
  }
  if (question.patternFamily) {
    cards.push({
      key: "pattern",
      node: <PatternStation patternFamily={question.patternFamily} questionTags={question.tags} />,
    });
  }
  if (question.selfTest) {
    cards.push({
      key: "self-test",
      node: <SelfTestStation steps={question.selfTest} />,
    });
  }
  if (question.interviewFraming) {
    cards.push({
      key: "interview",
      node: <InterviewStation text={question.interviewFraming} />,
    });
  }

  if (cards.length === 0) return null;

  return (
    <div className="md:hidden">
      <div className="mb-3 flex items-center justify-between">
        <span className="tabular font-mono text-[10px] font-semibold text-[color:var(--accent)]">Stations</span>
        <span className="text-[10.5px] text-muted">Swipe →</span>
      </div>
      <div
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {cards.map((c) => (
          <div
            key={c.key}
            className="w-[85vw] shrink-0 snap-start"
          >
            {c.node}
          </div>
        ))}
      </div>
    </div>
  );
}
