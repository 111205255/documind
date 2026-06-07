"use client";

import { SearchIcon } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

export function DocumentSearchBar({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative mb-5", className)}>
      <SearchIcon
        className="pointer-events-none absolute left-4 top-1/2 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-[var(--text-tertiary)]"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documents"
        aria-label="Search documents"
        className={cn(
          "h-12 w-full rounded-full border border-[var(--doc-search-border)] bg-[var(--doc-search-bg)]",
          "pl-11 pr-4 text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]",
          "transition-shadow duration-[var(--duration-fast)]",
          "focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/15",
        )}
      />
    </div>
  );
}
