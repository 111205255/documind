"use client";

import Link from "next/link";
import { DocumentIcon } from "@/components/brand/icons";
import { ROUTES } from "@/lib/constants";
import type { DocumentListItem } from "@/types/document";

/** Figma frame 04 — document grid card */
export function DocumentGridCard({ document }: { document: DocumentListItem }) {
  return (
    <Link
      href={ROUTES.document(document.id)}
      className="hover-lift group flex min-h-[9.5rem] flex-col rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--doc-card-bg)] text-[var(--text-primary)] shadow-[var(--doc-card-shadow)] transition-all duration-[var(--duration-normal)] hover:border-[var(--border-focus)] hover:shadow-[var(--doc-card-shadow-hover)]"
      style={{ padding: "var(--doc-card-padding)" }}
      data-testid="document-grid-card"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white transition-transform duration-[var(--duration-fast)] group-hover:scale-105">
        <DocumentIcon className="h-5 w-5" />
      </div>
      <h3 className="figma-card-title line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--brand-primary)]">
        {document.title}
      </h3>
      <p className="figma-meta mt-1.5 text-[var(--text-secondary)]">
        {document.pageCount > 0 ? `${document.pageCount} pages · ` : ""}
        {document.relativeTime}
      </p>
    </Link>
  );
}
