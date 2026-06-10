"use client";

import { cn } from "@/lib/utils";

/** Figma frame 06 — arc spinner on soft brand circle */
export function ProcessingArcSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--citation-bg)]",
        className,
      )}
      role="status"
      aria-label="Processing"
      data-testid="processing-arc-spinner"
    >
      <svg className="h-12 w-12 animate-spin" viewBox="0 0 48 48" aria-hidden>
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="80 45"
        />
      </svg>
    </div>
  );
}
