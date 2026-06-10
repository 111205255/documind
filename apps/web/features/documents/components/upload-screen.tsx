"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentIcon, LinkIcon } from "@/components/brand/icons";
import { FadeIn } from "@/components/motion/fade-in";
import { ROUTES } from "@/lib/constants";
import { uploadDocument } from "@/services/documents/upload-document";
import { uploadUrlDocument } from "@/services/documents/upload-url-document";

/** Frame 05 — upload to Supabase Storage */
export function UploadScreen() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [showUrl, setShowUrl] = useState(false);

  const onUrl = async () => {
    setError(null);
    setUploading(true);
    try {
      const { document } = await uploadUrlDocument(url);
      router.push(ROUTES.processing(document.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save link.");
    } finally {
      setUploading(false);
    }
  };

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

  const options = [
    {
      title: "Upload a PDF",
      subtitle: "Up to 50 MB",
      onClick: () => inputRef.current?.click(),
    },
    {
      title: "Upload Word document",
      subtitle: ".docx or .doc",
      onClick: () => inputRef.current?.click(),
    },
    {
      title: "Paste a web link",
      subtitle: "Any public article or page",
      onClick: () => setShowUrl(true),
    },
  ];

  return (
    <div className="figma-content-stack">
      <FadeIn>
        <h1 className="figma-page-title">Upload document</h1>
        <p className="figma-meta -mt-6">PDF, Word, or a web link</p>
      </FadeIn>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />

      {showUrl ? (
        <FadeIn className="space-y-3">
          <div className="relative">
            <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              className="figma-search-input !max-w-none pl-11"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={uploading}
            />
          </div>
          <button
            type="button"
            disabled={uploading || !url.trim()}
            onClick={() => void onUrl()}
            className="figma-primary-btn w-full"
          >
            {uploading ? "Indexing…" : "Index link"}
          </button>
          <button
            type="button"
            className="text-sm text-[var(--text-secondary)] hover:underline"
            onClick={() => setShowUrl(false)}
          >
            Back
          </button>
        </FadeIn>
      ) : (
        <ul className="flex flex-col gap-3" data-testid="upload-options">
          {options.map((opt, i) => (
            <FadeIn key={opt.title} delay={i * 0.05}>
              <li>
                <button
                  type="button"
                  disabled={uploading}
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
        <p className="text-sm text-[var(--error)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
