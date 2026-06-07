"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { FadeIn } from "@/components/motion/fade-in";
import { isApiConfigured } from "@/lib/api-url";
import { ROUTES } from "@/lib/constants";
import {
  downloadDocumentFile,
  ingestDocumentForRag,
} from "@/services/api/ingest-document";
import { getDocumentById } from "@/services/documents/get-document";

/** Step 4: index document in ChromaDB, then open chat (Step 5). */
export function ProcessingScreen({ documentId }: { documentId: string }) {
  const router = useRouter();
  const started = useRef(false);
  const [title, setTitle] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = async () => {
      try {
        const doc = await getDocumentById(documentId);
        if (!doc) {
          setError("Document not found.");
          return;
        }
        setTitle(doc.title);

        if (!isApiConfigured()) {
          router.replace(ROUTES.chatThread(documentId));
          return;
        }

        if (doc.mime_type !== "application/pdf") {
          router.replace(ROUTES.chatThread(documentId));
          return;
        }

        const file = await downloadDocumentFile(
          doc.storage_path,
          doc.file_name,
          doc.mime_type,
        );
        await ingestDocumentForRag(documentId, file);
        router.replace(ROUTES.chatThread(documentId));
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Indexing failed.");
      }
    };

    void run();
  }, [documentId, router]);

  if (error) {
    return (
      <>
        <ScreenHeader title="Indexing failed" subtitle={title ?? "Your document"} />
        <FadeIn className="mt-8 text-center">
          <p className="text-sm text-[var(--error)]">{error}</p>
          <Button className="mt-6" onClick={() => router.push(ROUTES.chatThread(documentId))}>
            Open chat anyway
          </Button>
          <Button
            className="mt-3"
            variant="secondary"
            onClick={() => router.push(ROUTES.home)}
          >
            Back to library
          </Button>
        </FadeIn>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Indexing" subtitle={title ?? "Your document"} />
      <FadeIn className="mt-8 flex flex-col items-center text-center">
        <Spinner size="lg" />
        <p className="mt-4 font-medium text-[var(--text-primary)]">AI is reading your document…</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Usually takes 10–30 seconds. You&apos;ll open chat when ready.
        </p>
        <div className="mt-8 w-full space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </FadeIn>
    </>
  );
}
