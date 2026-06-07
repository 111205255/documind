"use client";

import { cn } from "@/lib/utils";

export interface CitationPillProps {
  index: number;
  page?: number;
  onClick?: () => void;
  className?: string;
}

export function CitationPill({ index, page, onClick, className }: CitationPillProps) {
  const label = page != null ? `[${index}] p.${page}` : `[${index}]`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] border px-2 py-0.5 text-xs font-medium",
        "border-[var(--citation-border)] bg-[var(--citation-bg)] text-[var(--citation-text)]",
        "transition-transform duration-[var(--duration-fast)] hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className,
      )}
    >
      {label}
    </button>
  );
}
