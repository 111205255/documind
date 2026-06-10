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
    <Modal open={open} onClose={onClose} className="max-w-lg !p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white">
          <DocumentIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-[var(--text-primary)]">{documentTitle}</p>
          <p className="mt-0.5 text-sm text-[var(--brand-primary)]">
            Page {citation.page} · Section citation
          </p>
        </div>
      </div>

      <blockquote className="relative mt-8 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--citation-border)] bg-[var(--citation-bg)] py-5 pl-6 pr-5">
        <span
          className="absolute left-0 top-0 h-full w-1 bg-[var(--brand-primary)]"
          aria-hidden
        />
        <span className="text-2xl font-bold leading-none text-[var(--brand-primary)]">&ldquo;</span>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">{citation.excerpt}</p>
      </blockquote>

      <button
        type="button"
        onClick={onClose}
        className="interaction-press mt-8 h-12 w-full rounded-[var(--radius-lg)] bg-[var(--brand-primary)] text-sm font-semibold text-white"
      >
        Open full document
      </button>

      <p className="mt-4 text-center text-xs text-[var(--text-tertiary)]">
        Citation verified against source document
      </p>
    </Modal>
  );
}
