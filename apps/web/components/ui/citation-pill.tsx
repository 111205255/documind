"use client";

import { cn } from "@/lib/utils";

export interface CitationPillProps {
  index: number;
  page?: number;
  onClick?: () => void;
  className?: string;
}

/** Figma frame 08 — citation chip below assistant message */
export function CitationPill({ index, page, onClick, className }: CitationPillProps) {
  const label =
    page != null ? `Page ${page} · Section ${index}` : `Citation ${index}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2.5 py-1 text-xs font-medium",
        "border-[var(--citation-border)] bg-[var(--citation-bg)] text-[var(--citation-text)]",
        "transition-all duration-[var(--duration-fast)] hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className,
      )}
    >
      <span aria-hidden className="text-[10px] leading-none">
        “
      </span>
      {label}
    </button>
  );
}
