"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { ROUTES } from "@/lib/constants";
import { uploadDocument } from "@/services/documents/upload-document";

/** Frame 05 — upload to Supabase Storage (Blueprint Step 3) */
export function UploadScreen() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { document } = await uploadDocument(file);
      router.push(ROUTES.processing(document.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <ScreenHeader title="Upload" subtitle="PDF or Word · up to 50 MB" />
      <FadeIn>
        <Card
          className="mt-6 flex cursor-pointer flex-col items-center border-dashed py-12 text-center"
          onClick={() => !uploading && inputRef.current?.click()}
        >
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {uploading ? "Uploading…" : "Tap to select or drag a file"}
          </p>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">PDF, DOCX, or DOC</p>
          <Button className="mt-6" variant="secondary" type="button" disabled={uploading}>
            Choose file
          </Button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
        </Card>
        {error ? (
          <p className="mt-4 text-center text-sm text-[var(--error)]" role="alert">
            {error}
          </p>
        ) : null}
      </FadeIn>
    </>
  );
}
