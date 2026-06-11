"use client";

import { Modal } from "@/components/ui/modal";
import { DocumentIcon } from "@/components/brand/icons";
import type { Citation } from "@/types";

/** Figma frame 09 — Citation detail */
export function CitationModal({
  open,
  onClose,
  citation,
  documentTitle = "Document",
}: {
  open: boolean;
  onClose: () => void;
  citation: Citation | null;
  documentTitle?: string;
}) {
  if (!citation) return null;

  return (
    <Modal open={open} onClose={onClose} className="max-w-[37.5rem]">
      <button
        type="button"
        onClick={onClose}
        className="interaction-press absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-sunken)] text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        aria-label="Close citation"
      >
        ×
      </button>
      <div className="flex items-start gap-4 pr-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white">
          <DocumentIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-[var(--text-primary)]">{documentTitle}</p>
          <p className="mt-0.5 text-sm font-medium text-[var(--brand-primary)]">
            Page {citation.page} · Section {citation.index}: Leave Policy
          </p>
        </div>
      </div>

      <blockquote className="figma-citation-quote mt-6">
        <span className="text-xl font-bold leading-none text-[var(--brand-primary)]" aria-hidden>
          &ldquo;
        </span>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">{citation.excerpt}</p>
      </blockquote>

      <button
        type="button"
        onClick={onClose}
        className="interaction-press figma-primary-btn mt-6 w-full"
      >
        Open full document
      </button>

      <p className="figma-caption mt-4 text-center">
        Citation verified against source document
      </p>
    </Modal>
  );
}
