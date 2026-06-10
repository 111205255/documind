"use client";

import { useState } from "react";
import { EmailIcon, LinkIcon, WhatsAppIcon } from "@/components/brand/icons";
import { Modal } from "@/components/ui/modal";
import { AnimatedToggle } from "@/components/ui/animated-toggle";

/** Figma frame 14 — Share document */
export function ShareDocumentModal({
  open,
  onClose,
  shareText,
  shareUrl,
  documentTitle = "Document",
}: {
  open: boolean;
  onClose: () => void;
  shareText?: string;
  shareUrl?: string;
  documentTitle?: string;
}) {
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!shareUrl) return null;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsapp = () => {
    const text = [shareText, shareUrl].filter(Boolean).join("\n\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  const email = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(documentTitle)}&body=${encodeURIComponent(shareText ?? shareUrl)}`,
      "_blank",
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Share document"
      subtitle="Anyone with the link can view this document."
      className="!p-8"
    >
      <div className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-sunken)] p-2 pl-4">
        <LinkIcon className="shrink-0 text-[var(--text-tertiary)]" />
        <span className="min-w-0 flex-1 truncate text-sm text-[var(--text-secondary)]">{shareUrl}</span>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="interaction-press shrink-0 rounded-[var(--radius-md)] bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white transition"
          data-testid="share-copy-button"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="mt-6 text-xs text-[var(--text-tertiary)]">Or share via</p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {[
          { label: "Email", icon: EmailIcon, action: email },
          { label: "WhatsApp", icon: WhatsAppIcon, action: whatsapp },
          { label: "Copy link", icon: LinkIcon, action: () => void copyLink() },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="hover-lift interaction-press flex flex-col items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-sunken)] py-5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-focus)]"
          >
            <item.icon className="text-[var(--brand-primary)]" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-sunken)] px-4 py-3.5">
        <span className="text-sm font-medium text-[var(--text-primary)]">Allow downloads</span>
        <AnimatedToggle
          label="Allow downloads"
          checked={allowDownloads}
          onChange={setAllowDownloads}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="interaction-press mt-8 h-12 w-full rounded-[var(--radius-lg)] bg-[var(--brand-primary)] text-sm font-semibold text-white shadow-[var(--doc-fab-shadow)]"
      >
        Done
      </button>
    </Modal>
  );
}
