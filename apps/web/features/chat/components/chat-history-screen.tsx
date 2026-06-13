"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChatBubbleIcon, DocumentIcon, SearchIcon, TrashIcon } from "@/components/brand/icons";
import { Spinner } from "@/components/ui/spinner";
import { FadeIn } from "@/components/motion/fade-in";
import { FloatingIcon } from "@/components/motion/floating-icon";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
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
  const [searchFocused, setSearchFocused] = useState(false);
  const reducedMotion = useReducedMotion();

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
    <div className="w-full" data-testid="chat-history-screen">
      <FadeIn>
        <header className="figma-page-header">
          <h1 className="figma-page-title">Chats</h1>
          <motion.div
            className="figma-search-field shrink-0"
            animate={
              reducedMotion || !searchFocused
                ? { scale: 1 }
                : { scale: 1.02 }
            }
            transition={{ type: "spring", damping: 28, stiffness: 400 }}
          >
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search chats"
              aria-label="Search chats"
              className="figma-search-input"
            />
          </motion.div>
        </header>
      </FadeIn>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Spinner />
        </div>
      ) : !loading && filtered.length === 0 ? (
        <FadeIn className="mt-16 flex flex-col items-center px-4 text-center">
          <FloatingIcon>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--doc-empty-icon-bg)] text-[var(--brand-primary)] shadow-[var(--doc-empty-icon-shadow)]">
              <ChatBubbleIcon className="h-7 w-7" />
            </div>
          </FloatingIcon>
          <p className="font-semibold text-[var(--text-primary)]">
            {search ? "No chats match your search" : "No conversations yet"}
          </p>
          <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
            {search
              ? "Try a different search term."
              : "Open a document from Home and start chatting to see your history here."}
          </p>
          {!search ? (
            <Link
              href={ROUTES.home}
              className="figma-primary-btn hover-lift mt-6"
            >
              Browse documents
            </Link>
          ) : null}
        </FadeIn>
      ) : (
        <StaggerList className="flex flex-col gap-3 p-0">
          {filtered.map((t) => (
            <StaggerItem key={t.id} className="list-none">
              <HistoryRow
                thread={t}
                deleting={deletingId === t.id}
                onDelete={() => void onDelete(t)}
                reducedMotion={reducedMotion}
              />
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}

function HistoryRow({
  thread,
  deleting,
  onDelete,
  reducedMotion,
}: {
  thread: ThreadListItem;
  deleting: boolean;
  onDelete: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      role="listitem"
      whileHover={reducedMotion ? undefined : { y: -2 }}
      transition={{ type: "spring", damping: 28, stiffness: 420 }}
      className="group flex items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] px-5 py-5 transition-[border-color,box-shadow] duration-[var(--duration-normal)] hover:border-[var(--border-focus)] hover:shadow-[var(--shadow-sm)]"
    >
      <Link href={ROUTES.chatThread(thread.documentId)} className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-b from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white transition-transform duration-[var(--duration-fast)] group-hover:scale-105">
          <DocumentIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-[var(--text-primary)]">{thread.title}</p>
          <p className="mt-0.5 truncate text-sm text-[var(--text-secondary)]">{thread.preview}</p>
        </div>
        <span className="shrink-0 text-xs text-[var(--text-tertiary)]">
          {formatRelativeTime(thread.updatedAt)}
        </span>
      </Link>
      <button
        type="button"
        aria-label={`Delete chat ${thread.title}`}
        disabled={deleting}
        onClick={onDelete}
        className="interaction-press shrink-0 rounded-[var(--radius-md)] p-2 text-[var(--text-tertiary)] opacity-0 transition hover:bg-[var(--surface-sunken)] hover:text-[var(--error)] group-hover:opacity-100 disabled:opacity-50"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
