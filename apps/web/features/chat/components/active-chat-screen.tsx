"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChatBubbleIcon, SendIcon, ShareIcon } from "@/components/brand/icons";
import { CitationPill } from "@/components/ui/citation-pill";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { IconButton } from "@/components/ui/icon-button";
import { FloatingIcon } from "@/components/motion/floating-icon";
import { ThinkingDots } from "@/components/motion/thinking-dots";
import { ThinkingSparkle } from "@/components/motion/thinking-sparkle";
import { SlideUp } from "@/components/motion/slide-up";
import { ShareSheet } from "@/features/settings/components/share-sheet";
import { ShareDocumentModal } from "@/features/settings/components/share-document-modal";
import { useThinkingPhase } from "@/features/chat/hooks/use-thinking-phase";
import type { ThinkingPhase } from "@/features/chat/hooks/use-thinking-phase";
import { AiThinkingBubble } from "./ai-thinking-bubble";
import { CitationModal } from "./citation-modal";
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

const PANEL_STARTERS = ["Carry forward?", "Maternity leave?", "Notice period?"];

export function ActiveChatScreen({
  documentId,
  documentTitle = "Document",
  layout = "mobile",
  onCitationSelect,
  onThinkingChange,
}: {
  documentId: string;
  documentTitle?: string;
  layout?: "mobile" | "panel";
  onCitationSelect?: (citation: Citation) => void;
  onThinkingChange?: (state: {
    thinking: boolean;
    phase: ThinkingPhase;
    scanRange: string;
  }) => void;
}) {
  const isPanel = layout === "panel";
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const { phase: thinkingPhase, scanRange } = useThinkingPhase(thinking);

  useEffect(() => {
    onThinkingChange?.({ thinking, phase: thinkingPhase, scanRange });
  }, [thinking, thinkingPhase, scanRange, onThinkingChange]);

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
    onCitationSelect?.(c);
    if (isPanel) setCitationModalOpen(true);
    else setSheetOpen(true);
  };

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  const sendQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || thinking || !threadId) return;

    setError(null);
    setInput("");
    setFollowUps([]);
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
      const { answer, citations, followUpQuestions } = await askDocument(documentId, trimmed);
      setFollowUps(followUpQuestions);
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
      await saveMessage(threadId, "user", trimmed);
      await saveMessage(threadId, "assistant", answer, citations);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not get an answer.";
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
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

  const starters = isPanel ? PANEL_STARTERS : STARTER_QUESTIONS;
  const heightClass = isPanel
    ? "flex h-full min-h-0 flex-col p-[var(--chat-panel-padding)]"
    : "flex h-[calc(100dvh-var(--bottom-nav-height)-2rem)] flex-col px-4 py-4";

  return (
    <div className={heightClass}>
      <header
        className={cn(
          "flex items-center gap-2 pb-3",
          isPanel ? "border-b border-[var(--panel-border)]" : "border-b border-[var(--border-default)]",
        )}
      >
        <div className="flex-1">
          <h1 className="truncate text-base font-semibold leading-tight text-[var(--text-primary)]">
            Chat
          </h1>
          {isPanel ? (
            <p className="figma-caption mt-0.5">Ask about this document</p>
          ) : (
            <p className="truncate text-lg font-semibold text-[var(--text-primary)]">
              {documentTitle}
            </p>
          )}
        </div>
        <IconButton label="Share" onClick={() => setShareOpen(true)}>
          <ShareIcon className="h-4 w-4" />
        </IconButton>
        {!isPanel ? (
          <Link href={ROUTES.chatHistory}>
            <IconButton label="Chat history">⋯</IconButton>
          </Link>
        ) : null}
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto py-4" role="log" aria-live="polite">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ThinkingDots />
          </div>
        ) : null}

        {!loading && messages.length === 0 && isPanel ? (
          <p className="text-sm leading-relaxed text-[var(--text-primary)]" data-testid="chat-welcome-message">
            Hi! I&apos;ve read {documentTitle}. Ask me anything and I&apos;ll point you to the exact
            page.
          </p>
        ) : null}

        {!loading && messages.length === 0 && !isPanel ? (
          <div className="flex flex-col items-center pt-8 text-center" data-testid="chat-empty-state">
            <FloatingIcon>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--citation-bg)] text-[var(--brand-primary)]">
                <ChatBubbleIcon className="h-7 w-7" />
              </div>
            </FloatingIcon>
            <p className="font-semibold text-[var(--text-primary)]">Start the conversation</p>
            <p className="mt-2 max-w-xs text-sm text-[var(--text-secondary)]">
              Ask anything about this document — you&apos;ll get answers with exact page citations.
            </p>
            <div className="mt-6 flex w-full flex-col gap-2">
              {starters.map((q) => (
                <StarterChip key={q} label={q} onClick={() => void sendQuestion(q)} />
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((msg) => (
          <SlideUp key={msg.id}>
            <MessageBubble message={msg} onCitationClick={openCitation} panel={isPanel} />
          </SlideUp>
        ))}

        {thinking ? <AiThinkingBubble phase={thinkingPhase} scanRange={scanRange} /> : null}

        {!thinking && followUps.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {followUps.map((q) => (
              <StarterChip key={q} label={q} onClick={() => void sendQuestion(q)} small />
            ))}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mb-2 text-center text-xs text-[var(--error)]" role="alert">
          {error}
        </p>
      ) : null}

      {isPanel && !thinking ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {starters.map((q) => (
            <StarterChip key={q} label={q} onClick={() => void sendQuestion(q)} small />
          ))}
        </div>
      ) : null}

      <form
        className="mt-auto flex items-center gap-2 border-t border-[var(--border-default)] pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          void sendQuestion(input);
        }}
      >
        <input
          className="flex-1 rounded-full border border-[var(--border-default)] bg-[var(--surface-sunken)] px-4 text-sm transition-shadow duration-[var(--duration-fast)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/15"
          style={{ height: "var(--chat-input-height)" }}
          placeholder={messages.length ? "Ask a follow-up…" : isPanel ? "Ask a follow-up…" : "Ask anything…"}
          aria-label="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={thinking || loading}
        />
        <button
          type="submit"
          disabled={thinking || loading || !input.trim()}
          className={cn(
            "interaction-press flex shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white shadow-[var(--doc-fab-shadow)] transition disabled:opacity-50",
            thinking && "overflow-visible",
          )}
          aria-label={thinking ? "AI is thinking" : "Send"}
          data-testid="chat-send-button"
          style={{
            width: "var(--chat-send-size)",
            height: "var(--chat-send-size)",
          }}
        >
          {thinking ? <ThinkingSparkle active /> : <SendIcon className="h-[18px] w-[18px]" />}
        </button>
      </form>

      {!isPanel ? (
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title={documentTitle}
          subtitle={
            activeCitation
              ? `Page ${activeCitation.page} · Section ${activeCitation.index}`
              : undefined
          }
        >
          {activeCitation ? (
            <blockquote className="figma-citation-quote">
              <span className="text-xl font-bold leading-none text-[var(--brand-primary)]" aria-hidden>
                &ldquo;
              </span>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
                {activeCitation.excerpt}
              </p>
            </blockquote>
          ) : null}
        </BottomSheet>
      ) : (
        <CitationModal
          open={citationModalOpen}
          onClose={() => setCitationModalOpen(false)}
          citation={activeCitation}
          documentTitle={documentTitle}
        />
      )}

      {isPanel ? (
        <ShareDocumentModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          shareText={lastAssistant?.content}
          shareUrl={
            typeof window !== "undefined"
              ? `${window.location.origin}${ROUTES.chatThread(documentId)}`
              : undefined
          }
          documentTitle={documentTitle}
        />
      ) : (
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
      )}
    </div>
  );
}

function StarterChip({
  label,
  onClick,
  small,
}: {
  label: string;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "interaction-press rounded-full border border-[var(--border-default)] bg-[var(--surface-sunken)] text-[var(--text-primary)] transition-all duration-[var(--duration-fast)] hover:border-[var(--brand-primary)] hover:bg-[var(--citation-bg)]",
        small ? "px-3 py-1.5 text-xs font-medium" : "w-full px-4 py-3 text-left text-sm",
      )}
      data-testid="starter-chip"
    >
      {label}
    </button>
  );
}

function MessageBubble({
  message,
  onCitationClick,
  panel,
}: {
  message: ChatMessage;
  onCitationClick: (c: Citation) => void;
  panel?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] text-sm leading-relaxed",
          isUser
            ? "figma-user-bubble max-w-[85%]"
            : cn(
                "figma-assistant-bubble max-w-[88%]",
                !panel && "border border-[var(--border-default)]",
                panel && "figma-assistant-bubble--panel",
              ),
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
