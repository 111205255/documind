"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Figma frame 13 — spring toggle switch */
export function AnimatedToggle({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 rounded-full transition-colors duration-[var(--duration-fast)]",
        checked ? "bg-[var(--brand-primary)]" : "bg-[var(--border-strong)]",
        className,
      )}
      data-testid={`toggle-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <motion.span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow"
        animate={{ left: checked ? 22 : 2 }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", damping: 28, stiffness: 420 }
        }
      />
    </button>
  );
}
