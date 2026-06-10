"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { DocumentIcon } from "@/components/brand/icons";
import { FadeIn } from "@/components/motion/fade-in";
import { useUploadModal } from "@/context/upload-modal-context";
import { ROUTES } from "@/lib/constants";
import { uploadDocument } from "@/services/documents/upload-document";
import { uploadUrlDocument } from "@/services/documents/upload-url-document";

export function UploadModal() {
  const { open, closeUpload } = useUploadModal();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);

  const reset = () => {
    setUrl("");
    setError(null);
    setShowUrl(false);
    setLoading(false);
  };

  const onClose = () => {
    reset();
    closeUpload();
  };

  const afterUpload = (documentId: string) => {
    onClose();
    router.push(ROUTES.processing(documentId));
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { document } = await uploadDocument(file);
      afterUpload(document.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setLoading(false);
    }
  };

  const onUrlSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { document } = await uploadUrlDocument(url);
      afterUpload(document.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save link.");
      setLoading(false);
    }
  };

  const options = [
    {
      title: "Upload a PDF",
      subtitle: "Up to 50 MB",
      onClick: () => fileRef.current?.click(),
    },
    {
      title: "Upload Word document",
      subtitle: ".docx or .doc",
      onClick: () => fileRef.current?.click(),
    },
    {
      title: "Paste a web link",
      subtitle: "Any public article or page",
      onClick: () => setShowUrl(true),
    },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Add a document">
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />

      {showUrl ? (
        <div className="space-y-3">
          <input
            className="h-11 w-full rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-sunken)] px-4 text-sm"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            disabled={loading || !url.trim()}
            onClick={() => void onUrlSubmit()}
            className="h-11 w-full rounded-[var(--radius-lg)] bg-[var(--brand-primary)] text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Indexing…" : "Index link"}
          </button>
          <button
            type="button"
            className="text-sm text-[var(--text-secondary)] hover:underline"
            onClick={() => setShowUrl(false)}
          >
            Back
          </button>
        </div>
      ) : (
        <ul className="space-y-4" data-testid="upload-options">
          {options.map((opt, i) => (
            <FadeIn key={opt.title} delay={i * 0.06}>
            <li>
              <button
                type="button"
                disabled={loading}
                onClick={opt.onClick}
                className="hover-lift interaction-press flex w-full items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-sunken)] p-5 text-left transition-all duration-[var(--duration-normal)] hover:border-[var(--border-focus)] disabled:opacity-60"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white">
                  <DocumentIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{opt.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{opt.subtitle}</p>
                </div>
              </button>
            </li>
            </FadeIn>
          ))}
        </ul>
      )}

      {error ? (
        <p className="mt-4 text-sm text-[var(--error)]" role="alert">
          {error}
        </p>
      ) : null}
    </Modal>
  );
}
