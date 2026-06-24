"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationProps {
  active: boolean;
}

const COLORS = [
  "var(--accent)",
  "var(--status-revisited)",
  "var(--diff-easy)",
  "var(--state-matched)",
  "var(--diff-medium)",
];

export default function Celebration({ active }: CelebrationProps) {
  // Stable per-burst particle set; changes only when active flips on.
  const particles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = 90 + Math.random() * 110;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 5 + Math.random() * 5,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.05,
      };
    });
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <div
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
          aria-hidden="true"
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: 0,
                scale: 0,
                rotate: Math.random() > 0.5 ? 90 : -90,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.85,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.color,
                boxShadow: `0 0 10px ${p.color}`,
              }}
            />
          ))}

          {/* Small centered flash */}
          <motion.div
            initial={{ opacity: 0.6, scale: 0.2 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute h-24 w-24 rounded-full bg-[color:var(--accent-soft)]"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
