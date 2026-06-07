"use client";

import Link from "next/link";
import { DocumentOutlineIcon, PlusIcon } from "@/components/brand/icons";
import { ROUTES } from "@/lib/constants";
import { FadeIn } from "@/components/motion/fade-in";

/** Figma frame 03 — empty home */
export function DocumentsEmptyState() {
  return (
    <FadeIn className="flex flex-1 flex-col items-center justify-center py-8 text-center">
      <div
        className="flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-[2rem] bg-[var(--doc-empty-icon-bg)] text-[var(--brand-primary)] shadow-[var(--doc-empty-icon-shadow)]"
        aria-hidden
      >
        <DocumentOutlineIcon className="h-12 w-12" />
      </div>

      <h2 className="mt-8 text-xl font-bold text-[var(--text-primary)]">No documents yet</h2>
      <p className="mt-3 max-w-[16.5rem] text-base leading-relaxed text-[var(--text-secondary)]">
        Upload a PDF, Word file or paste a link to start chatting with it.
      </p>

      <Link
        href={ROUTES.upload}
        className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-6 text-base font-semibold text-white shadow-[var(--doc-fab-shadow)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--brand-primary-hover)] active:scale-[0.98]"
      >
        <PlusIcon />
        Upload your first document
      </Link>
    </FadeIn>
  );
}
