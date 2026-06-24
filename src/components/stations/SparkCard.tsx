"use client";

export default function SparkCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] p-5 md:p-6">
      <p className="prose-col text-[14.5px] leading-[1.75] text-[color:var(--text-primary)] md:text-[15px]">
        {text}
      </p>
    </div>
  );
}
