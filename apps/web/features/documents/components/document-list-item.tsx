"use client";

import Link from "next/link";
import { ChevronRightIcon, DocumentIcon } from "@/components/brand/icons";
import { ROUTES } from "@/lib/constants";
import type { DocumentListItem } from "@/types/document";
import { cn } from "@/lib/utils";

export function DocumentListItemCard({
  document,
  className,
}: {
  document: DocumentListItem;
  className?: string;
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

      <ChevronRightIcon className="shrink-0 text-[var(--doc-chevron)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
