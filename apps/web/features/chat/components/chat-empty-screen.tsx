"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

/** Figma frame 07 — chat empty (no document selected) */
export function ChatEmptyScreen() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-10 items-center justify-center rounded-full bg-[var(--citation-bg)] text-2xl text-[var(--brand-primary)]">
        💬
      </div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Start the conversation</h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        Select a document from Home or upload a new one to begin chatting with citations.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href={ROUTES.home}>
          <Button>Browse documents</Button>
        </Link>
        <Link href={ROUTES.chatHistory}>
          <Button variant="secondary">Chat history</Button>
        </Link>
      </div>
    </div>
  );
}
