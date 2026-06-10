"use client";

import { ThinkingDots } from "@/components/motion/thinking-dots";
import { SlideUp } from "@/components/motion/slide-up";
import { SkeletonLines } from "@/components/ui/skeleton-lines";
import type { ThinkingPhase } from "@/features/chat/hooks/use-thinking-phase";

/** Figma frame 10 — AI thinking bubble with skeleton + scanning phases */
export function AiThinkingBubble({
  phase,
  scanRange,
}: {
  phase: ThinkingPhase;
  scanRange: string;
}) {
  const isScanning = phase === "scanning";

  return (
    <SlideUp>
      <div className="flex justify-start">
        <div
          className="max-w-[88%] rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--chat-assistant-bg)] px-4 py-3"
          role="status"
          aria-live="polite"
          aria-label={isScanning ? `Scanning pages ${scanRange}` : "Searching the document"}
        >
          <div className="flex items-center gap-2.5">
            {isScanning ? (
              <DocumentScanIcon />
            ) : (
              <ThinkingDots />
            )}
            <span className="text-sm text-[var(--text-secondary)]">
              {isScanning ? `Scanning pages ${scanRange}` : "Searching the document..."}
            </span>
          </div>
          {!isScanning ? (
            <div className="mt-2.5">
              <SkeletonLines lines={2} gap={6} />
            </div>
          ) : null}
        </div>
      </div>
    </SlideUp>
  );
}

function DocumentScanIcon() {
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
      className="shrink-0 text-[var(--brand-primary)]"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
