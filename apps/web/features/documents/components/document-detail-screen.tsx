"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DocumentIcon } from "@/components/brand/icons";
import { ROUTES } from "@/lib/constants";
import { formatFileSize } from "@/lib/format-file-size";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { deleteDocument } from "@/services/documents/delete-document";
import { ShareDocumentModal } from "@/features/settings/components/share-document-modal";

function mimeLabel(mimeType: string): string {
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("word")) return "Word";
  if (mimeType.includes("url")) return "Web link";
  return "Document";
}

/** Figma frame 11 — Document details */
export function DocumentDetailScreen({
  id,
  title = "Document",
  mimeType = "application/pdf",
  pageCount = 0,
  fileSizeBytes,
  updatedAt,
  questionsCount = 0,
}: {
  id: string;
  title?: string;
  mimeType?: string;
  pageCount?: number;
  fileSizeBytes?: number | null;
  updatedAt?: string;
  questionsCount?: number;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metaParts = [
    mimeLabel(mimeType),
    pageCount > 0 ? `${pageCount} pages` : null,
    formatFileSize(fileSizeBytes),
  ].filter(Boolean);

  const onDelete = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteDocument(id);
      router.push(ROUTES.home);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}${ROUTES.chatThread(id)}` : undefined;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-[var(--text-primary)]">Document details</h1>

      <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white">
            <DocumentIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{metaParts.join(" · ")}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { value: questionsCount, label: "Questions asked" },
          { value: "—", label: "Citations opened" },
          { value: updatedAt ? formatRelativeTime(updatedAt) : "—", label: "Last active" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 text-center"
          >
            <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)]">
        <Link
          href={ROUTES.chatThread(id)}
          className="flex items-center justify-between border-b border-[var(--border-default)] px-5 py-4 transition hover:bg-[var(--surface-sunken)]"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)]">
            <span className="text-[var(--text-secondary)]" aria-hidden>👁</span>
            View document
          </span>
          <span className="text-[var(--text-tertiary)]">›</span>
        </Link>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="flex w-full items-center justify-between border-b border-[var(--border-default)] px-5 py-4 text-left transition hover:bg-[var(--surface-sunken)]"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)]">
            <span className="text-[var(--text-secondary)]" aria-hidden>↗</span>
            Share document
          </span>
          <span className="text-[var(--text-tertiary)]">›</span>
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={() => void onDelete()}
          className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium text-[var(--brand-primary)] transition hover:bg-[var(--surface-sunken)] disabled:opacity-50"
        >
          <span aria-hidden>🗑</span>
          {deleting ? "Deleting…" : "Delete document"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-center text-sm text-[var(--error)]" role="alert">
          {error}
        </p>
      ) : null}

      <ShareDocumentModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={shareUrl}
        documentTitle={title}
      />
    </div>
  );
}
