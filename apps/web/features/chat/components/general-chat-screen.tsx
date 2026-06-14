"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ChatBubbleIcon, SendIcon } from "@/components/brand/icons";
import { FadeIn } from "@/components/motion/fade-in";
import { FloatingIcon } from "@/components/motion/floating-icon";
import { SlideUp } from "@/components/motion/slide-up";
import { ThinkingDots } from "@/components/motion/thinking-dots";
import { ThinkingSparkle } from "@/components/motion/thinking-sparkle";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ROUTES } from "@/lib/constants";
import { askGeneralChat, type GeneralChatTurn } from "@/services/api/chat";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const STARTERS = [
  "Explain a tricky concept simply",
  "Help me draft an email",
  "Brainstorm ideas for a project",
  "Summarize a topic for me",
];

/** Document-less ("normal") chat with the AI — Chat tab. */
export function GeneralChatScreen() {
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === "dark";
  const isEmpty = messages.length === 0;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const sendQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || thinking) return;

    setError(null);
    setInput("");
    setFollowUps([]);
    setThinking(true);

    const history: GeneralChatTurn[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const { answer, followUpQuestions } = await askGeneralChat(trimmed, history);
      setFollowUps(followUpQuestions);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: answer },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not get an answer.");
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-var(--bottom-nav-height)-2rem)] w-full max-w-3xl flex-col lg:h-full lg:min-h-0 lg:px-8 lg:py-6">
      <header className="flex items-center gap-2 border-b border-[var(--border-default)] pb-3">
        <div className="flex-1">
          <h1 className="text-base font-semibold leading-tight text-[var(--text-primary)]">Chat</h1>
          <p className="figma-caption mt-0.5">Ask the AI anything</p>
        </div>
        <Link
          href={ROUTES.home}
          className="figma-starter-chip interaction-press px-3 py-1.5 text-xs font-medium text-[var(--text-primary)]"
        >
          Chat with a document
        </Link>
      </header>

      <div
        ref={logRef}
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto py-4",
          isEmpty && "justify-center",
        )}
        role="log"
        aria-live="polite"
      >
        {isEmpty ? (
          <FadeIn className="flex flex-col items-center px-2 text-center" data-testid="general-chat-empty">
            <FloatingIcon>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--citation-bg)] text-[var(--brand-primary)] shadow-[var(--doc-empty-icon-shadow)]">
                <ChatBubbleIcon className="h-7 w-7" />
              </div>
            </FloatingIcon>
            <p className="font-semibold text-[var(--text-primary)]">How can I help?</p>
            <p className="mt-2 max-w-xs text-sm text-[var(--text-secondary)]">
              Chat with the AI about anything. To ask about a specific file, upload it from Home.
            </p>
            <StaggerList className="mt-6 grid w-full max-w-md gap-2 sm:grid-cols-2">
              {STARTERS.map((q) => (
                <StaggerItem key={q}>
                  <StarterChip label={q} onClick={() => void sendQuestion(q)} reducedMotion={reducedMotion} />
                </StaggerItem>
              ))}
            </StaggerList>
          </FadeIn>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <SlideUp key={msg.id}>
                <Bubble message={msg} isDark={isDark} />
              </SlideUp>
            ))}
            {thinking ? (
              <div className="figma-assistant-bubble figma-assistant-bubble--panel inline-flex w-auto max-w-[88%] items-center">
                <ThinkingDots />
              </div>
            ) : null}
            {!thinking && followUps.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
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
        )}
      </div>

      {error ? (
        <p className="mb-2 text-center text-xs text-[var(--error)]" role="alert">
          {error}
        </p>
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
          placeholder={messages.length ? "Ask a follow-up…" : "Ask anything…"}
          aria-label="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={thinking}
        />
        <motion.button
          type="submit"
          disabled={thinking || !input.trim()}
          whileHover={reducedMotion || thinking || !input.trim() ? undefined : { scale: 1.1 }}
          whileTap={reducedMotion ? undefined : { scale: 0.95 }}
          transition={{ type: "spring", damping: 22, stiffness: 400 }}
          className={cn(
            "interaction-press flex shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white shadow-[var(--doc-fab-shadow)] transition disabled:opacity-50",
            input.trim() && !thinking && "hover-brand-glow",
          )}
          aria-label={thinking ? "AI is thinking" : "Send"}
          data-testid="general-chat-send"
          style={{ width: "var(--chat-send-size)", height: "var(--chat-send-size)" }}
        >
          {thinking ? <ThinkingSparkle active /> : <SendIcon className="h-[18px] w-[18px]" />}
        </motion.button>
      </form>
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

function Bubble({ message, isDark }: { message: Msg; isDark?: boolean }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed",
          isUser
            ? "figma-user-bubble"
            : isDark
              ? "figma-assistant-bubble figma-assistant-bubble--panel max-w-[88%]"
              : "max-w-full text-[var(--text-primary)]",
        )}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
}
