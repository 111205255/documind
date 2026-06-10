"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRightIcon,
  DocumentIcon,
  EyeIcon,
  ShareIcon,
  TrashIcon,
} from "@/components/brand/icons";
import { FadeIn } from "@/components/motion/fade-in";
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
    <FadeIn className="figma-content-stack">
      <h1 className="figma-page-title">Document details</h1>

      <div className="figma-doc-hero-card">
        <div className="figma-doc-hero-icon">
          <DocumentIcon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="figma-card-title text-lg">{title}</h2>
          <p className="figma-meta mt-1">{metaParts.join(" · ")}</p>
        </div>
      </div>

      <div className="figma-stat-grid">
        {[
          { value: questionsCount, label: "Questions asked" },
          { value: "—", label: "Citations opened" },
          { value: updatedAt ? formatRelativeTime(updatedAt) : "—", label: "Last active" },
        ].map((stat) => (
          <div key={stat.label} className="figma-stat-card">
            <p className="figma-stat-value">{stat.value}</p>
            <p className="figma-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="figma-action-list">
        <Link href={ROUTES.chatThread(id)} className="figma-action-row hover-lift">
          <span className="flex items-center gap-3">
            <EyeIcon className="text-[var(--text-secondary)]" />
            View document
          </span>
          <ChevronRightIcon className="text-[var(--text-tertiary)]" />
        </Link>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="figma-action-row hover-lift"
        >
          <span className="flex items-center gap-3">
            <ShareIcon className="text-[var(--text-secondary)]" />
            Share document
          </span>
          <ChevronRightIcon className="text-[var(--text-tertiary)]" />
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={() => void onDelete()}
          className="figma-action-row figma-action-row--destructive hover-lift disabled:opacity-50"
        >
          <span className="flex items-center gap-3">
            <TrashIcon />
            {deleting ? "Deleting…" : "Delete document"}
          </span>
        </button>
      </div>

      {error ? (
        <p className="text-center text-sm text-[var(--error)]" role="alert">
          {error}
        </p>
      ) : null}

      <ShareDocumentModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={shareUrl}
        documentTitle={title}
      />
    </FadeIn>
  );
}
