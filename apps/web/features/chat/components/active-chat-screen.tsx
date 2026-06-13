"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ChatBubbleIcon, SendIcon, ShareIcon } from "@/components/brand/icons";
import { CitationPill } from "@/components/ui/citation-pill";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { IconButton } from "@/components/ui/icon-button";
import { FadeIn } from "@/components/motion/fade-in";
import { FloatingIcon } from "@/components/motion/floating-icon";
import { ThinkingDots } from "@/components/motion/thinking-dots";
import { ThinkingSparkle } from "@/components/motion/thinking-sparkle";
import { SlideUp } from "@/components/motion/slide-up";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motion } from "framer-motion";
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

const PANEL_STARTERS = ["Summarize this", "Key points?", "Main takeaways?"];

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
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
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
      // Keep the user's question visible and surface the failure once via the
      // styled inline error below — avoid also injecting a fake assistant
      // bubble that reads as if the AI replied with the error text.
      const msg = e instanceof Error ? e.message : "Could not get an answer.";
      setError(msg);
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

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto py-4",
          !loading && messages.length === 0 && isPanel && "justify-center",
        )}
        role="log"
        aria-live="polite"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ThinkingDots />
          </div>
        ) : null}

        {!loading && messages.length === 0 ? (
          <FadeIn className={cn("flex flex-col items-center text-center", isPanel ? "px-2" : "pt-8")} data-testid="chat-empty-state">
            <FloatingIcon>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--citation-bg)] text-[var(--brand-primary)] shadow-[var(--doc-empty-icon-shadow)]">
                <ChatBubbleIcon className="h-7 w-7" />
              </div>
            </FloatingIcon>
            <p className="font-semibold text-[var(--text-primary)]">Start the conversation</p>
            <p className="mt-2 max-w-xs text-sm text-[var(--text-secondary)]">
              Ask anything about this document — you&apos;ll get answers with exact page citations.
            </p>
            {!isPanel ? (
              <StaggerList className="mt-6 flex w-full flex-col gap-2">
                {starters.map((q) => (
                  <StaggerItem key={q}>
                    <StarterChip label={q} onClick={() => void sendQuestion(q)} reducedMotion={reducedMotion} />
                  </StaggerItem>
                ))}
              </StaggerList>
            ) : null}
          </FadeIn>
        ) : null}

        {messages.length > 0 ? (
          <div className="space-y-4">
            {isPanel ? (
              resolvedTheme === "dark" ? (
                <div
                  className="figma-assistant-bubble figma-assistant-bubble--panel max-w-[88%]"
                  data-testid="chat-welcome-message"
                >
                  <p>
                    Hi! I&apos;ve read {documentTitle}. Ask me anything and I&apos;ll point you to
                    the exact page.
                  </p>
                </div>
              ) : (
                <p
                  className="text-sm leading-relaxed text-[var(--text-primary)]"
                  data-testid="chat-welcome-message"
                >
                  Hi! I&apos;ve read {documentTitle}. Ask me anything and I&apos;ll point you to the
                  exact page.
                </p>
              )
            ) : null}
            {messages.map((msg) => (
              <SlideUp key={msg.id}>
                <MessageBubble
                  message={msg}
                  onCitationClick={openCitation}
                  panel={isPanel}
                  isDark={resolvedTheme === "dark"}
                />
              </SlideUp>
            ))}
          </div>
        ) : null}

        {thinking ? <AiThinkingBubble phase={thinkingPhase} scanRange={scanRange} /> : null}

        {!thinking && followUps.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {followUps.map((q) => (
              <StarterChip
                key={q}
                label={q}
                onClick={() => void sendQuestion(q)}
                small
                reducedMotion={reducedMotion}
              />
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
        <StaggerList className="mb-3 flex flex-wrap gap-2">
          {starters.map((q) => (
            <StaggerItem key={q}>
              <StarterChip
                label={q}
                onClick={() => void sendQuestion(q)}
                small
                reducedMotion={reducedMotion}
              />
            </StaggerItem>
          ))}
        </StaggerList>
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
        <motion.button
          type="submit"
          disabled={thinking || loading || !input.trim()}
          animate={
            reducedMotion || thinking || !input.trim()
              ? { scale: 1 }
              : { scale: 1.06 }
          }
          whileHover={
            reducedMotion || thinking || !input.trim()
              ? undefined
              : { scale: 1.1 }
          }
          whileTap={reducedMotion ? undefined : { scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 400 }}
          className={cn(
            "interaction-press flex shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white shadow-[var(--doc-fab-shadow)] transition disabled:opacity-50",
            thinking && "overflow-visible",
            input.trim() && !thinking && "hover-brand-glow",
          )}
          aria-label={thinking ? "AI is thinking" : "Send"}
          data-testid="chat-send-button"
          style={{
            width: "var(--chat-send-size)",
            height: "var(--chat-send-size)",
          }}
        >
          {thinking ? <ThinkingSparkle active /> : <SendIcon className="h-[18px] w-[18px]" />}
        </motion.button>
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
  reducedMotion,
}: {
  label: string;
  onClick: () => void;
  small?: boolean;
  reducedMotion?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", damping: 26, stiffness: 420 }}
      className={cn(
        "figma-starter-chip interaction-press text-[var(--text-primary)]",
        small ? "px-3 py-1.5 text-xs font-medium" : "w-full px-4 py-3 text-left text-sm",
      )}
      data-testid="starter-chip"
    >
      {label}
    </motion.button>
  );
}

function MessageBubble({
  message,
  onCitationClick,
  panel,
  isDark,
}: {
  message: ChatMessage;
  onCitationClick: (c: Citation) => void;
  panel?: boolean;
  isDark?: boolean;
}) {
  const isUser = message.role === "user";
  const assistantPlain = panel && !isDark;

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] text-sm leading-relaxed",
          isUser
            ? "figma-user-bubble"
            : assistantPlain
              ? "max-w-full text-[var(--text-primary)]"
              : cn(
                  "figma-assistant-bubble max-w-[88%]",
                  !panel && "border border-[var(--border-default)]",
                  panel && "figma-assistant-bubble--panel",
                ),
        )}
      >
        <p>{message.content}</p>
      </div>
      {!isUser && message.citations?.length ? (
        <div className="mt-2 flex max-w-[88%] flex-wrap gap-1.5">
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
  );
}
