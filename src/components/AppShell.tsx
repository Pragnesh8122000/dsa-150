"use client";

import Shell from "./Shell";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import CommandPalette from "./CommandPalette";
import { useLastVisited } from "@/hooks/useLastVisited";
import { useCodeMode } from "@/hooks/useCodeMode";

export default function AppShell({ children }: { children: React.ReactNode }) {
  useLastVisited();
  const { codeMode } = useCodeMode();

  return (
    <Shell>
      <div className="relative min-h-full">
        {/* Global top-right controls — hidden when the code workspace is open */}
        {!codeMode && (
          <div className="pointer-events-none fixed right-0 top-0 z-50 flex items-center gap-2 p-4 md:p-5">
            <div className="pointer-events-auto">
              <CommandPalette />
            </div>
            <div className="pointer-events-auto">
              <ThemeToggle />
            </div>
            <div className="pointer-events-auto md:hidden">
              <MobileNav />
            </div>
          </div>
        )}

        <div className={`${codeMode ? "" : "pt-16 md:pt-0"}`}>{children}</div>
      </div>
    </Shell>
  );
}
