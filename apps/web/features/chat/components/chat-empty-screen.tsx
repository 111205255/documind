"use client";

import Link from "next/link";
import { ChatBubbleIcon } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { FloatingIcon } from "@/components/motion/floating-icon";
import { FadeIn } from "@/components/motion/fade-in";
import { ROUTES } from "@/lib/constants";

/** Figma frame 07 — chat empty (no document selected) */
export function ChatEmptyScreen() {
  return (
    <FadeIn className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <FloatingIcon>
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--doc-empty-icon-bg)] text-[var(--brand-primary)] shadow-[var(--doc-empty-icon-shadow)]">
          <ChatBubbleIcon className="h-8 w-8" />
        </div>
      </FloatingIcon>
      <h1 className="figma-section-title">Start the conversation</h1>
      <p className="figma-meta mt-3 max-w-sm text-base leading-relaxed">
        Select a document from Home or upload a new one to begin chatting with citations.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={ROUTES.home}>
          <Button>Browse documents</Button>
        </Link>
        <Link href={ROUTES.chatHistory}>
          <Button variant="secondary">Chat history</Button>
        </Link>
      </div>
    </FadeIn>
  );
}
