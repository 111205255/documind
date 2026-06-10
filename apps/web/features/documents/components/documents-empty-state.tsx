"use client";

import { DocumentOutlineIcon, PlusIcon } from "@/components/brand/icons";
import { FadeIn } from "@/components/motion/fade-in";
import { FloatingIcon } from "@/components/motion/floating-icon";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

/** Figma frame 03 — empty home, centered in main canvas */
export function DocumentsEmptyState({ onUpload }: { onUpload?: () => void }) {
  const uploadBtn = (
    <span className="figma-primary-btn mt-10">
      <PlusIcon />
      Upload your first document
    </span>
  );

  return (
    <FadeIn
      className="flex min-h-[calc(100dvh-12rem)] flex-col items-center justify-center py-16 text-center lg:min-h-[calc(100dvh-8rem)]"
      data-testid="documents-empty-state"
    >
      <FloatingIcon>
        <div
          className="flex items-center justify-center text-[var(--brand-primary)] shadow-[var(--doc-empty-icon-shadow)]"
          style={{
            width: "var(--doc-empty-icon-size)",
            height: "var(--doc-empty-icon-size)",
            borderRadius: "var(--doc-empty-icon-radius)",
            background: "var(--doc-empty-icon-bg)",
          }}
          aria-hidden
        >
          <DocumentOutlineIcon className="h-12 w-12" />
        </div>
      </FloatingIcon>

      <h2 className="figma-section-title mt-10">No documents yet</h2>
      <p className="figma-meta mt-4 max-w-md text-base leading-relaxed">
        Upload a PDF, Word file or paste a link to start chatting with it.
      </p>

      {onUpload ? (
        <button type="button" onClick={onUpload} className="interaction-press">
          {uploadBtn}
        </button>
      ) : (
        <Link href={ROUTES.upload} className="interaction-press">
          {uploadBtn}
        </Link>
      )}
    </FadeIn>
  );
}
