"use client";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

/** Frame 14 — share answer */
export function ShareSheet({
  open,
  onClose,
  shareText,
  shareUrl,
}: {
  open: boolean;
  onClose: () => void;
  shareText?: string;
  shareUrl?: string;
}) {
  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    onClose();
  };

  const copyAnswer = async () => {
    if (!shareText) return;
    await navigator.clipboard.writeText(shareText);
    onClose();
  };

  const whatsapp = () => {
    const text = [shareText, shareUrl].filter(Boolean).join("\n\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Share">
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Copy the answer or share via WhatsApp.
      </p>
      <div className="flex flex-col gap-2">
        <Button fullWidth variant="secondary" type="button" onClick={() => void copyAnswer()}>
          Copy answer
        </Button>
        <Button fullWidth variant="secondary" type="button" onClick={() => void copyLink()}>
          Copy chat link
        </Button>
        <Button fullWidth variant="secondary" type="button" onClick={whatsapp}>
          WhatsApp
        </Button>
      </div>
    </BottomSheet>
  );
}
