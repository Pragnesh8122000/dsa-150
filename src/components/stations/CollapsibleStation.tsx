"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsibleStationProps {
  id: string;
  eyebrow: string;
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleStation({
  id,
  eyebrow,
  title,
  icon,
  defaultOpen = false,
  children,
}: CollapsibleStationProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--surface-2)] overflow-hidden">
      <button
        id={`station-${id}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[color:var(--surface-3)] md:px-5 md:py-4"
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-[color:var(--accent)]">{icon}</span>}
          <div>
            <div className="mb-0.5 tabular font-mono text-[10px] font-semibold text-[color:var(--accent)]">
              {eyebrow}
            </div>
            <div className="text-[14px] font-semibold md:text-[15px]">{title}</div>
          </div>
        </div>
        <Chevron open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[color:var(--border-subtle)] px-4 py-4 md:px-5 md:py-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
