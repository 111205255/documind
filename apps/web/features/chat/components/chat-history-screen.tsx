"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DocumentIcon, SearchIcon, TrashIcon } from "@/components/brand/icons";
import { Spinner } from "@/components/ui/spinner";
import { FadeIn } from "@/components/motion/fade-in";
import { ROUTES } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/format-relative-time";
import {
  deleteThread,
  listUserThreads,
  type ThreadListItem,
} from "@/services/chat/persistence";

/** Figma frame 12 — chat history with search + delete */
export function ChatHistoryScreen() {
  const [threads, setThreads] = useState<ThreadListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void listUserThreads()
      .then(setThreads)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (t) => t.title.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q),
    );
  }, [threads, search]);

  const onDelete = async (thread: ThreadListItem) => {
    if (!confirm(`Delete chat "${thread.title}"?`)) return;
    setDeletingId(thread.id);
    try {
      await deleteThread(thread.id);
      setThreads((prev) => prev.filter((t) => t.id !== thread.id));
    } catch {
      alert("Could not delete chat. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[var(--dashboard-content-narrow)]" data-testid="chat-history-screen">
      <FadeIn>
        <header className="figma-page-header">
          <h1 className="figma-page-title">History</h1>
          <div className="figma-search-field shrink-0">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats"
              aria-label="Search chats"
              className="figma-search-input"
            />
          </div>
        </header>
      </FadeIn>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-[var(--text-secondary)]">
          {search ? "No chats match your search." : "No conversations yet. Open a document and start chatting."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3" role="list">
          {filtered.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.04}>
              <li>
                <div className="hover-lift group flex items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-4 transition-all duration-[var(--duration-normal)] hover:border-[var(--border-focus)] hover:shadow-[var(--shadow-sm)]">
                  <Link href={ROUTES.chatThread(t.documentId)} className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white transition-transform duration-[var(--duration-fast)] group-hover:scale-105">
                      <DocumentIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[var(--text-primary)]">{t.title}</p>
                      <p className="mt-0.5 truncate text-sm text-[var(--text-secondary)]">{t.preview}</p>
                    </div>
                    <span className="shrink-0 text-xs text-[var(--text-tertiary)]">
                      {formatRelativeTime(t.updatedAt)}
                    </span>
                  </Link>
                  <button
                    type="button"
                    aria-label={`Delete chat ${t.title}`}
                    disabled={deletingId === t.id}
                    onClick={() => void onDelete(t)}
                    className="interaction-press shrink-0 rounded-[var(--radius-md)] p-2 text-[var(--text-tertiary)] opacity-0 transition hover:bg-[var(--surface-sunken)] hover:text-[var(--error)] group-hover:opacity-100 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            </FadeIn>
          ))}
        </ul>
      )}
    </div>
  );
}
