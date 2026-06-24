import { Suspense } from "react";
import Dashboard from "@/components/Dashboard";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-14">
      <div className="mb-10 h-8 w-32 rounded bg-[color:var(--surface-2)]" />
      <div className="mb-10 h-24 rounded-xl bg-[color:var(--surface-2)]" />
      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[color:var(--surface-2)]" />
        ))}
      </div>
      <div className="mb-6 h-10 rounded-full bg-[color:var(--surface-2)]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 rounded-xl bg-[color:var(--surface-2)]" />
        ))}
      </div>
    </div>
  );
}
