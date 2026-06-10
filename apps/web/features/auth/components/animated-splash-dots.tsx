"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Figma frame 01 — cycling loading dots */
export function AnimatedSplashDots({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((i) => (i + 1) % 3), 520);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div
      className={cn("flex items-center justify-center gap-2.5", className)}
      role="tablist"
      aria-label="Loading"
      data-testid="splash-dots"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          role="tab"
          aria-selected={i === active}
          animate={
            reduced
              ? undefined
              : {
                  scale: i === active ? 1.15 : 1,
                  opacity: i === active ? 1 : 0.35,
                }
          }
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "h-2 w-2 rounded-full",
            i === active ? "bg-white" : "bg-white/40",
          )}
        />
      ))}
    </div>
  );
}
