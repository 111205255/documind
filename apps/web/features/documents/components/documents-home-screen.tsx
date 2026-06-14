"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { DocumentListItem } from "@/types/document";
import { DocumentSearchBar } from "./document-search-bar";
import { DocumentGridCard } from "./document-grid-card";
import { DocumentListItemCard } from "./document-list-item";
import { DocumentsEmptyState } from "./documents-empty-state";
import { useUploadModal } from "@/context/upload-modal-context";
import { deleteDocument } from "@/services/documents/delete-document";
import { FadeIn } from "@/components/motion/fade-in";

export interface DocumentsHomeScreenProps {
  documents?: DocumentListItem[];
}

function filterDocuments(items: DocumentListItem[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((d) => d.title.toLowerCase().includes(q));
}

/** Figma frames 03 (empty) & 04 (library) */
export function DocumentsHomeScreen({ documents }: DocumentsHomeScreenProps) {
  const router = useRouter();
  const [items, setItems] = useState<DocumentListItem[]>(documents ?? []);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { openUpload } = useUploadModal();

  // Keep local copy in sync when the server refetches.
  useEffect(() => {
    setItems(documents ?? []);
  }, [documents]);

  const isEmpty = items.length === 0;
  const filtered = useMemo(() => filterDocuments(items, search), [items, search]);

  const handleDelete = async (doc: DocumentListItem) => {
    if (deletingId) return;
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    setError(null);
    try {
      await deleteDocument(doc.id);
      setItems((prev) => prev.filter((d) => d.id !== doc.id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

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
        {error ? (
          <p className="mb-4 text-sm text-[var(--error)]" role="alert">
            {error}
          </p>
        ) : null}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          style={{ gap: "var(--doc-card-gap)" }}
          data-testid="documents-grid"
        >
          {filtered.map((doc, i) => (
            <FadeIn key={doc.id} delay={i * 0.03}>
              <DocumentGridCard
                document={doc}
                onDelete={handleDelete}
                deleting={deletingId === doc.id}
              />
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
        {error ? (
          <p className="mt-4 text-sm text-[var(--error)]" role="alert">
            {error}
          </p>
        ) : null}
        <ul className="mt-4 flex flex-col gap-3" role="list">
          {filtered.map((doc, i) => (
            <li key={doc.id}>
              <FadeIn delay={i * 0.04}>
                <DocumentListItemCard
                  document={doc}
                  onDelete={handleDelete}
                  deleting={deletingId === doc.id}
                />
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
