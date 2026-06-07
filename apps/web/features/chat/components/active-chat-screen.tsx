"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CitationPill } from "@/components/ui/citation-pill";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { IconButton } from "@/components/ui/icon-button";
import { ThinkingDots } from "@/components/motion/thinking-dots";
import { SlideUp } from "@/components/motion/slide-up";
import { ShareSheet } from "@/features/settings/components/share-sheet";
import { ROUTES } from "@/lib/constants";
import { askDocument } from "@/services/api/chat";
import {
  getOrCreateThread,
  loadThreadMessages,
  saveMessage,
} from "@/services/chat/persistence";
import type { ChatMessage, Citation } from "@/types";
import { cn } from "@/lib/utils";

const STARTER_QUESTIONS = [
  "What is this document about?",
  "Summarize the key points.",
  "What are the main conclusions?",
];

/** Hero frame 08 + citation sheet (09) + thinking (10) — API + persistence */
export function ActiveChatScreen({
  documentId,
  documentTitle = "Document",
}: {
  documentId: string;
  documentTitle?: string;
}) {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const tid = await getOrCreateThread(documentId, documentTitle);
        if (cancelled) return;
        setThreadId(tid);
        const history = await loadThreadMessages(tid);
        if (!cancelled) setMessages(history);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load chat.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [documentId, documentTitle]);

  const openCitation = (c: Citation) => {
    setActiveCitation(c);
    setSheetOpen(true);
  };

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  const sendQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || thinking || !threadId) return;

    setError(null);
    setInput("");
    setThinking(true);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      threadId,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      await saveMessage(threadId, "user", trimmed);
      const { answer, citations } = await askDocument(documentId, trimmed);
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        threadId,
        role: "assistant",
        content: answer,
        citations,
        createdAt: new Date().toISOString(),
        status: "complete",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      await saveMessage(threadId, "assistant", answer, citations);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not get an answer.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          threadId,
          role: "assistant",
          content: msg,
          createdAt: new Date().toISOString(),
          status: "error",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-var(--header-height)-var(--bottom-nav-height)-2rem)] flex-col">
      <header className="flex items-center gap-2 border-b border-[var(--border-default)] pb-3">
        <h1 className="flex-1 truncate text-lg font-semibold">{documentTitle}</h1>
        <IconButton label="Share" onClick={() => setShareOpen(true)}>
          ↗
        </IconButton>
        <Link href={ROUTES.chatHistory}>
          <IconButton label="Chat history">⋯</IconButton>
        </Link>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto py-4" role="log" aria-live="polite">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ThinkingDots />
          </div>
        ) : null}

        {!loading && messages.length === 0 ? (
          <div className="space-y-3 pt-4">
            <p className="text-center text-sm text-[var(--text-secondary)]">
              Ask anything about this document.
            </p>
            <div className="flex flex-col gap-2">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void sendQuestion(q)}
                  className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-3 text-left text-sm text-[var(--text-primary)] transition hover:border-[var(--border-focus)]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((msg) => (
          <SlideUp key={msg.id}>
            <MessageBubble message={msg} onCitationClick={openCitation} />
          </SlideUp>
        ))}

        {thinking ? (
          <div className="flex items-center gap-2 rounded-[var(--radius-xl)] bg-[var(--chat-assistant-bg)] px-4 py-3">
            <ThinkingDots />
            <span className="text-sm text-[var(--text-secondary)]">Thinking…</span>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mb-2 text-center text-xs text-[var(--error)]" role="alert">
          {error}
        </p>
      ) : null}

      <form
        className="mt-auto flex gap-2 border-t border-[var(--border-default)] pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          void sendQuestion(input);
        }}
      >
        <input
          className="h-11 flex-1 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 text-sm"
          placeholder="Ask a question…"
          aria-label="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={thinking || loading}
        />
        <button
          type="submit"
          disabled={thinking || loading || !input.trim()}
          className="h-11 rounded-[var(--radius-lg)] bg-[var(--brand-primary)] px-4 text-sm font-medium text-white transition active:scale-95 disabled:opacity-50"
        >
          Send
        </button>
      </form>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={activeCitation ? `Citation [${activeCitation.index}]` : "Citation"}
      >
        {activeCitation ? (
          <>
            <p className="text-xs text-[var(--text-tertiary)]">Page {activeCitation.page}</p>
            <p className="mt-2 text-sm text-[var(--text-primary)]">{activeCitation.excerpt}</p>
          </>
        ) : null}
      </BottomSheet>

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareText={lastAssistant?.content}
        shareUrl={
          typeof window !== "undefined"
            ? `${window.location.origin}${ROUTES.chatThread(documentId)}`
            : undefined
        }
      />
    </div>
  );
}

function MessageBubble({
  message,
  onCitationClick,
}: {
  message: ChatMessage;
  onCitationClick: (c: Citation) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-[var(--radius-xl)] px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-[var(--chat-user-bg)] text-[var(--chat-user-text)]"
            : "border border-[var(--border-default)] bg-[var(--chat-assistant-bg)] text-[var(--chat-assistant-text)]",
        )}
      >
        <p>{message.content}</p>
        {message.citations?.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {message.citations.map((c) => (
              <CitationPill
                key={c.id}
                index={c.index}
                page={c.page}
                onClick={() => onCitationClick(c)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
