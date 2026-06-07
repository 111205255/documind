"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/constants";
import { listUserThreads, type ThreadListItem } from "@/services/chat/persistence";

/** Frame 12 — persisted threads */
export function ChatHistoryScreen() {
  const [threads, setThreads] = useState<ThreadListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listUserThreads()
      .then(setThreads)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ScreenHeader title="Chat history" />
      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner />
        </div>
      ) : threads.length === 0 ? (
        <p className="mt-12 text-center text-sm text-[var(--text-secondary)]">
          No conversations yet. Open a document and start chatting.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3" role="list">
          {threads.map((t) => (
            <li key={t.id}>
              <Link href={ROUTES.chatThread(t.documentId)}>
                <Card interactive>
                  <p className="font-medium text-[var(--text-primary)]">{t.title}</p>
                  <p className="mt-1 truncate text-sm text-[var(--text-tertiary)]">{t.preview}</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
