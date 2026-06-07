"use client";

import Link from "next/link";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

/** Document detail — frame 11 */
export function DocumentDetailScreen({
  id,
  title = "Document",
  status = "ready",
}: {
  id: string;
  title?: string;
  status?: string;
}) {
  const statusLabel =
    status === "processing"
      ? "Indexing…"
      : status === "failed"
        ? "Failed"
        : "Ready";

  return (
    <>
      <ScreenHeader title={title} subtitle="Document details" />
      <Card className="mt-4 space-y-2">
        <p className="text-sm text-[var(--text-secondary)]">Status</p>
        <p
          className={
            status === "failed"
              ? "font-medium text-[var(--error)]"
              : "font-medium text-[var(--success)]"
          }
        >
          {statusLabel}
        </p>
      </Card>
      <div className="mt-6 flex flex-col gap-3">
        <Link href={ROUTES.chatThread(id)}>
          <Button fullWidth>Chat with document</Button>
        </Link>
        <Button fullWidth variant="secondary" type="button">
          Share
        </Button>
      </div>
    </>
  );
}
