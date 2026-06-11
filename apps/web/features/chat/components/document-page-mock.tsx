"use client";

import { SkeletonLines } from "@/components/ui/skeleton-lines";
import { cn } from "@/lib/utils";

const DEFAULT_EXCERPT =
  "All permanent employees are entitled to 12 days of paid casual leave per calendar year, accrued at the rate of one day per month. Casual leave not availed within the year shall lapse.";

/** Figma frames 08 & 10 — stylized document page with skeleton lines + citation highlight */
export function DocumentPageMock({
  sectionTitle = "Section 5 — Leave Policy",
  highlightExcerpt = DEFAULT_EXCERPT,
  scanning = false,
  className,
}: {
  sectionTitle?: string;
  highlightExcerpt?: string;
  scanning?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-2xl rounded-[var(--radius-xl)] bg-[var(--doc-page-bg)] p-8 shadow-[var(--doc-card-shadow)]",
        scanning && "ring-2 ring-[var(--brand-primary)]/20",
        className,
      )}
      data-testid="document-page-mock"
    >
      <h3 className="text-base font-bold text-[var(--text-primary)]">{sectionTitle}</h3>

      <div className="mt-6 space-y-4">
        <SkeletonLines lines={3} gap={10} />
        <blockquote
          className={cn(
            "rounded-[var(--radius-lg)] border-l-4 border-[var(--brand-primary)] bg-[var(--citation-bg)] px-4 py-3 text-sm leading-relaxed text-[var(--text-primary)] transition-shadow duration-[var(--duration-normal)]",
            scanning && "animate-scan-highlight ring-2 ring-[var(--brand-primary)]/25",
          )}
        >
          {highlightExcerpt}
        </blockquote>
        <SkeletonLines lines={4} gap={10} />
      </div>
    </div>
  );
}
