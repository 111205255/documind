"use client";

import { useMemo, useState } from "react";
import { DEMO_DOCUMENTS } from "@/features/documents/data/demo-documents";
import type { DocumentListItem } from "@/types/document";
import { DocumentSearchBar } from "./document-search-bar";
import { DocumentGridCard } from "./document-grid-card";
import { DocumentListItemCard } from "./document-list-item";
import { DocumentsEmptyState } from "./documents-empty-state";
import { useUploadModal } from "@/context/upload-modal-context";
import { FadeIn } from "@/components/motion/fade-in";

export interface DocumentsHomeScreenProps {
  documents?: DocumentListItem[];
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
  const items = documents ?? (useDemoFallback ? DEMO_DOCUMENTS : []);
  const [search, setSearch] = useState("");
  const { openUpload } = useUploadModal();
  const isEmpty = items.length === 0;
  const filtered = useMemo(() => filterDocuments(items, search), [items, search]);

  if (isEmpty) {
    return <DocumentsEmptyState onUpload={openUpload} />;
  }

  return (
    <>
      {/* Desktop grid — frame 04 */}
      <div className="hidden h-full flex-col lg:flex" data-testid="documents-home-desktop">
        <header className="figma-page-header" data-testid="documents-page-header">
          <h1 className="figma-page-title m-0">Documents</h1>
          <DocumentSearchBar value={search} onChange={setSearch} className="figma-search-field shrink-0" />
        </header>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          style={{ gap: "var(--doc-card-gap)" }}
          data-testid="documents-grid"
        >
          {filtered.map((doc, i) => (
            <FadeIn key={doc.id} delay={i * 0.03}>
              <DocumentGridCard document={doc} />
            </FadeIn>
          ))}
        </div>
        {filtered.length === 0 && search ? (
          <p className="py-12 text-center text-sm text-[var(--text-secondary)]">
            No documents match &ldquo;{search}&rdquo;
          </p>
        ) : null}
      </div>

      {/* Mobile list */}
      <div className="lg:hidden" data-testid="documents-home-mobile">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Documents</h1>
        </header>
        <DocumentSearchBar value={search} onChange={setSearch} />
        <ul className="mt-4 flex flex-col gap-3" role="list">
          {filtered.map((doc, i) => (
            <li key={doc.id}>
              <FadeIn delay={i * 0.04}>
                <DocumentListItemCard document={doc} />
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
