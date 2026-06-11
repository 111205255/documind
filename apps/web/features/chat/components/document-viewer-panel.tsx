"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getDocumentViewInfo } from "@/services/documents/get-document-view-url";
import { cn } from "@/lib/utils";
import type { Citation } from "@/types";
import { DocumentPageMock } from "./document-page-mock";

/** Figma frames 08 & 10 — center document viewer with page chrome + citation highlight */
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
    "All permanent employees are entitled to 12 days of paid casual leave per calendar year, accrued at the rate of one day per month. Casual leave not availed within the year shall lapse.";
  const sectionTitle =
    activeCitation != null ? `Section ${activeCitation.index} — Leave Policy` : "Section 5 — Leave Policy";

  const isPdf = viewInfo?.mimeType === "application/pdf";
  const isUrl = viewInfo?.mimeType === "application/x-documind-url";
  const pdfSrc =
    viewInfo?.signedUrl && isPdf
      ? `${viewInfo.signedUrl}#page=${displayPage}&view=FitH`
      : null;

  const showMockPage = !pdfSrc && !isUrl;

  return (
    <section className="flex min-w-0 flex-1 flex-col border-r border-[var(--panel-border)] bg-[var(--viewer-bg)]">
      <header className="border-b border-[var(--panel-border)] px-[var(--chat-panel-padding)] py-4">
        <h2 className="truncate text-lg font-semibold leading-tight text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="figma-meta mt-1">
          {scanning && scanRange ? (
            <span className="text-[var(--brand-primary)]">Scanning pages {scanRange}…</span>
          ) : pageTotal > 0 ? (
            <>
              Page {displayPage} of {pageTotal}
            </>
          ) : (
            <>Page {displayPage} of 64</>
          )}
        </p>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {loading ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            <p className="text-center text-sm text-[var(--error)]">{error}</p>
            <DocumentPageMock
              sectionTitle={sectionTitle}
              highlightExcerpt={excerpt}
              scanning={scanning}
            />
          </div>
        ) : pdfSrc ? (
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden p-4">
            <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-xl)] bg-[var(--doc-page-bg)] shadow-[var(--doc-card-shadow)]">
              <iframe
                key={`${documentId}-${displayPage}`}
                src={pdfSrc}
                title={`${title} — page ${displayPage}`}
                className={cn(
                  "min-h-0 flex-1 border-0 bg-white transition-opacity duration-[var(--duration-normal)]",
                  scanning && "opacity-90",
                )}
              />
              {scanning ? (
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                  <div className="animate-scan-sweep absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[var(--brand-primary)]/20 to-transparent" />
                </div>
              ) : null}
            </div>
            {activeCitation ? (
              <div className="mx-auto mt-4 w-full max-w-3xl">
                <CitationExcerpt excerpt={excerpt} scanning={scanning} compact />
              </div>
            ) : null}
          </div>
        ) : isUrl && viewInfo?.sourceUrl ? (
          <div className="flex h-full flex-col p-4">
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-xl)] bg-[var(--doc-page-bg)] shadow-[var(--doc-card-shadow)]">
              <iframe
                src={viewInfo.sourceUrl}
                title={title}
                className="min-h-0 flex-1 border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
            <div className="mx-auto mt-3 w-full max-w-3xl text-xs">
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
        ) : showMockPage ? (
          <div
            className={cn(
              "flex flex-1 flex-col overflow-y-auto p-6",
              scanning && "relative",
            )}
          >
            {scanning ? (
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="animate-scan-sweep absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[var(--brand-primary)]/15 to-transparent" />
              </div>
            ) : null}
            <DocumentPageMock
              sectionTitle={sectionTitle}
              highlightExcerpt={excerpt}
              scanning={scanning}
            />
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
            <DocumentPageMock
              sectionTitle={sectionTitle}
              highlightExcerpt={excerpt}
              scanning={scanning}
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8">
            <DocumentPageMock
              sectionTitle={sectionTitle}
              highlightExcerpt={excerpt}
              scanning={scanning}
            />
          </div>
        )}
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
