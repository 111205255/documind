"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProcessingArcSpinner } from "@/components/ui/processing-arc-spinner";
import { FadeIn } from "@/components/motion/fade-in";
import { ErrorState } from "@/components/feedback/error-state";
import { isApiConfigured } from "@/lib/api-url";
import { ROUTES } from "@/lib/constants";
import {
  downloadDocumentFile,
  ingestDocumentForRag,
  ingestUrlForRag,
} from "@/services/api/ingest-document";
import { getDocumentById } from "@/services/documents/get-document";
/** Figma frame 06 — processing with arc spinner + progress */
export function ProcessingScreen({ documentId }: { documentId: string }) {
  const router = useRouter();
  const started = useRef(false);
  const [title, setTitle] = useState<string>();
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(12);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    started.current = false;

    const tick = setInterval(() => {
      setProgress((p) => Math.min(p + 3, 92));
    }, 450);

    const run = async () => {
      if (started.current) return;
      started.current = true;
      setError(null);
      setProgress(12);

      try {
        const doc = await getDocumentById(documentId);
        if (!doc) {
          setError("Document not found.");
          return;
        }
        setTitle(doc.title);
        setPageCount(doc.page_count ?? 0);

        if (!isApiConfigured()) {
          router.replace(ROUTES.chatThread(documentId));
          return;
        }

        if (doc.mime_type === "application/x-documind-url") {
          await ingestUrlForRag(documentId, doc.file_name, doc.title);
        } else {
          const file = await downloadDocumentFile(
            doc.storage_path,
            doc.file_name,
            doc.mime_type,
          );
          await ingestDocumentForRag(documentId, file);
        }
        setProgress(100);
        router.replace(ROUTES.chatThread(documentId));
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Indexing failed.");
      } finally {
        clearInterval(tick);
      }
    };

    void run();
    return () => clearInterval(tick);
  }, [documentId, router, attempt]);

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => setAttempt((n) => n + 1)}
      />
    );
  }

  const total = pageCount > 0 ? pageCount : 64;
  const indexedPage = Math.max(1, Math.round((progress / 100) * total));
  const statusLine =
    pageCount > 0
      ? `Indexing page ${Math.min(indexedPage, total)} of ${total}…`
      : `Indexing ${title ?? "your document"}…`;

  return (
    <FadeIn
      className="mx-auto flex min-h-[calc(100dvh-12rem)] max-w-lg flex-col items-center justify-center px-4 py-12 text-center lg:min-h-[calc(100dvh-8rem)]"
      data-testid="processing-screen"
    >
      <ProcessingArcSpinner />
      <h2 className="figma-section-title mt-8">Processing your document</h2>
      <p className="figma-meta mt-3 max-w-md text-base leading-relaxed">
        We&apos;re reading and indexing every page so you can ask questions with exact citations.
      </p>
      <div className="mt-10 h-2 w-full max-w-md overflow-hidden rounded-full bg-[var(--surface-sunken)]">
        <div
          className="h-full rounded-full bg-[var(--brand-primary)] transition-all duration-500 ease-[var(--ease-out)]"
          style={{ width: `${progress}%` }}
          data-testid="processing-progress"
        />
      </div>
      <p className="mt-4 text-sm text-[var(--text-secondary)]" data-testid="processing-status">
        {statusLine}
      </p>
    </FadeIn>
  );
}
