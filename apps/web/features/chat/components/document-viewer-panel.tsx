"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getDocumentViewInfo } from "@/services/documents/get-document-view-url";
import { cn } from "@/lib/utils";
import type { Citation } from "@/types";

/** Figma frames 08 & 10 — center document viewer with real PDF / URL preview */
export function DocumentViewerPanel({
  documentId,
  title,
  page = 1,
  totalPages,
  activeCitation,
  scanning = false,
  scanRange,
}: {
  documentId: string;
  title: string;
  page?: number;
  totalPages?: number;
  activeCitation?: Citation | null;
  scanning?: boolean;
  scanRange?: string;
}) {
  const [viewInfo, setViewInfo] = useState<Awaited<ReturnType<typeof getDocumentViewInfo>>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void getDocumentViewInfo(documentId)
      .then((info) => {
        if (!cancelled) setViewInfo(info);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load document.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  const displayPage = activeCitation?.page ?? page;
  const pageTotal = totalPages ?? viewInfo?.pageCount ?? 0;
  const excerpt =
    activeCitation?.excerpt ??
    "Select a citation in the chat panel to jump to the matching passage in your document.";

  const isPdf = viewInfo?.mimeType === "application/pdf";
  const isUrl = viewInfo?.mimeType === "application/x-documind-url";
  const pdfSrc =
    viewInfo?.signedUrl && isPdf
      ? `${viewInfo.signedUrl}#page=${displayPage}&view=FitH`
      : null;

  return (
    <section className="flex min-w-0 flex-1 flex-col border-r border-[var(--panel-border)] bg-[var(--viewer-bg)]">
      <header className="border-b border-[var(--panel-border)] px-6 py-5">
        <h2 className="truncate text-lg font-semibold leading-tight text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="figma-meta mt-1">
          {scanning && scanRange ? (
            <span className="text-[var(--brand-primary)]">Scanning pages {scanRange}…</span>
          ) : pageTotal > 0 ? (
            <>Page {displayPage} of {pageTotal}</>
          ) : (
            <>Document preview</>
          )}
        </p>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-[var(--error)]">
            {error}
          </div>
        ) : pdfSrc ? (
          <div className="relative h-full w-full overflow-hidden">
            <iframe
              key={`${documentId}-${displayPage}`}
              src={pdfSrc}
              title={`${title} — page ${displayPage}`}
              className={cn(
                "h-full w-full border-0 bg-white transition-opacity duration-[var(--duration-normal)]",
                scanning && "opacity-90",
              )}
            />
            {scanning ? (
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden
              >
                <div className="animate-scan-sweep absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[var(--brand-primary)]/20 to-transparent" />
              </div>
            ) : null}
          </div>
        ) : isUrl && viewInfo?.sourceUrl ? (
          <div className="flex h-full flex-col">
            <iframe
              src={viewInfo.sourceUrl}
              title={title}
              className="min-h-0 flex-1 border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
            <div className="border-t border-[var(--panel-border)] px-4 py-2 text-xs">
              <a
                href={viewInfo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand-primary)] hover:underline"
              >
                Open source page in new tab
              </a>
            </div>
          </div>
        ) : viewInfo?.signedUrl ? (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-8">
            <p className="text-sm text-[var(--text-secondary)]">
              Word documents open best in your browser or desktop app.
            </p>
            <a
              href={viewInfo.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit rounded-[var(--radius-lg)] bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              Open document
            </a>
            <CitationExcerpt excerpt={excerpt} scanning={scanning} />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-[var(--text-secondary)]">
            Preview unavailable for this document.
          </div>
        )}

        {(isPdf || isUrl) && activeCitation ? (
          <div className="border-t border-[var(--panel-border)] bg-[var(--surface-raised)] p-4">
            <CitationExcerpt excerpt={excerpt} scanning={scanning} compact />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CitationExcerpt({
  excerpt,
  scanning,
  compact,
}: {
  excerpt: string;
  scanning?: boolean;
  compact?: boolean;
}) {
  return (
    <blockquote
      className={cn(
        "rounded-[var(--radius-lg)] border-l-4 border-[var(--brand-primary)] bg-[var(--citation-bg)] text-sm leading-relaxed text-[var(--text-primary)] transition-shadow duration-[var(--duration-normal)]",
        compact ? "px-3 py-2" : "px-4 py-3",
        scanning && "animate-scan-highlight ring-2 ring-[var(--brand-primary)]/25",
      )}
    >
      {excerpt}
    </blockquote>
  );
}
