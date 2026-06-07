"use client";

import { useMemo, useState } from "react";
import { DEMO_DOCUMENTS } from "@/features/documents/data/demo-documents";
import type { DocumentListItem } from "@/types/document";
import { DocumentsPageShell } from "./documents-page-shell";
import { DocumentsHeader } from "./documents-header";
import { DocumentSearchBar } from "./document-search-bar";
import { DocumentListItemCard } from "./document-list-item";
import { DocumentsEmptyState } from "./documents-empty-state";
import { UploadFab } from "./upload-fab";
import { FadeIn } from "@/components/motion/fade-in";

export interface DocumentsHomeScreenProps {
  /** Pass `[]` or use `?empty` on /home for empty state */
  documents?: DocumentListItem[];
  /** Show Figma demo cards when Supabase returns no rows (dev without uploads) */
  useDemoFallback?: boolean;
}

function filterDocuments(items: DocumentListItem[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((d) => d.title.toLowerCase().includes(q));
}

/** Figma frames 03 (empty) & 04 (library) */
export function DocumentsHomeScreen({
  documents,
  useDemoFallback = false,
}: DocumentsHomeScreenProps) {
  const items =
    documents ?? (useDemoFallback ? DEMO_DOCUMENTS : []);
  const [search, setSearch] = useState("");
  const isEmpty = items.length === 0;

  const filtered = useMemo(
    () => filterDocuments(items, search),
    [items, search],
  );

  return (
    <DocumentsPageShell>
      <DocumentsHeader />

      {isEmpty ? (
        <DocumentsEmptyState />
      ) : (
        <>
          <DocumentSearchBar value={search} onChange={setSearch} />

          <ul className="flex flex-col gap-3" role="list">
            {filtered.map((doc, i) => (
              <li key={doc.id}>
                <FadeIn delay={i * 0.04}>
                  <DocumentListItemCard document={doc} />
                </FadeIn>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && search ? (
            <p className="py-12 text-center text-sm text-[var(--text-secondary)]">
              No documents match &ldquo;{search}&rdquo;
            </p>
          ) : null}

          <UploadFab />
        </>
      )}
    </DocumentsPageShell>
  );
}
