"use client";

import { EmptyState } from "@/components/feedback/empty-state";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

/** Hero frame 07 */
export function ChatEmptyScreen() {
  return (
    <>
      <ScreenHeader
        title="Chat"
        action={
          <Link href={ROUTES.chatHistory}>
            <Button size="sm" variant="ghost">
              History
            </Button>
          </Link>
        }
      />
      <EmptyState
        title="Ask your documents anything"
        description="Select a document or start a new conversation."
        illustration={<span className="text-4xl">💬</span>}
        action={
          <Link href={ROUTES.home}>
            <Button fullWidth variant="secondary">
              Browse documents
            </Button>
          </Link>
        }
      />
    </>
  );
}
