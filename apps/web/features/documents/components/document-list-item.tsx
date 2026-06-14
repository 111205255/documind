"use client";

import Link from "next/link";
import { ChevronRightIcon, DocumentIcon, TrashIcon } from "@/components/brand/icons";
import { ROUTES } from "@/lib/constants";
import type { DocumentListItem } from "@/types/document";
import { cn } from "@/lib/utils";

export function DocumentListItemCard({
  document,
  className,
  onDelete,
  deleting,
}: {
  document: DocumentListItem;
  className?: string;
  onDelete?: (doc: DocumentListItem) => void;
  deleting?: boolean;
}) {
  const meta = `${document.pageCount} pages · ${document.relativeTime}`;

  return (
    <Link
      href={ROUTES.document(document.id)}
      className={cn(
        "group flex items-center gap-3.5 rounded-2xl border border-transparent bg-[var(--doc-card-bg)] p-3.5",
        "shadow-[var(--doc-card-shadow)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--doc-card-shadow-hover)] active:translate-y-0 active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
        className,
      )}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white"
        aria-hidden
      >
        <DocumentIcon className="!h-5 !w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[var(--text-primary)]">{document.title}</p>
        <p className="mt-0.5 truncate text-sm text-[var(--text-secondary)]">{meta}</p>
      </div>

      {onDelete ? (
        <button
          type="button"
          aria-label={`Delete ${document.title}`}
          disabled={deleting}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(document);
          }}
          className="interaction-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--error)]/10 text-[var(--error)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--error)] hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--error)]/40 disabled:opacity-50"
          data-testid="document-card-delete"
        >
          <TrashIcon className="h-[18px] w-[18px]" />
        </button>
      ) : (
        <ChevronRightIcon className="shrink-0 text-[var(--doc-chevron)] transition-transform group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}
