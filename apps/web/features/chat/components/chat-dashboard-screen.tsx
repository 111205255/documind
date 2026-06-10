"use client";

import { useCallback, useState } from "react";
import { ActiveChatScreen } from "./active-chat-screen";
import { DocumentViewerPanel } from "./document-viewer-panel";
import type { ThinkingPhase } from "@/features/chat/hooks/use-thinking-phase";
import type { Citation } from "@/types";

/** Figma frames 07–10 — sidebar (shell) + viewer + chat panel */
export function ChatDashboardScreen({
  documentId,
  documentTitle = "Document",
  pageCount,
}: {
  documentId: string;
  documentTitle?: string;
  pageCount?: number;
}) {
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [thinkingState, setThinkingState] = useState<{
    thinking: boolean;
    phase: ThinkingPhase;
    scanRange: string;
  }>({ thinking: false, phase: "searching", scanRange: "10–15" });

  const handleThinkingChange = useCallback(
    (state: { thinking: boolean; phase: ThinkingPhase; scanRange: string }) => {
      setThinkingState(state);
    },
    [],
  );

  return (
    <>
      {/* Mobile — single chat column */}
      <div className="h-[calc(100dvh-var(--bottom-nav-height)-2rem)] lg:hidden" data-testid="chat-mobile-layout">
        <ActiveChatScreen documentId={documentId} documentTitle={documentTitle} layout="mobile" />
      </div>

      {/* Desktop — viewer + chat (sidebar from DashboardShell) */}
      <div className="hidden h-full min-h-0 flex-1 lg:flex" data-testid="chat-desktop-layout">
        <DocumentViewerPanel
          documentId={documentId}
          title={documentTitle}
          totalPages={pageCount}
          activeCitation={activeCitation}
          scanning={thinkingState.thinking && thinkingState.phase === "scanning"}
          scanRange={thinkingState.scanRange}
        />
        <section
          className="flex shrink-0 flex-col border-l border-[var(--panel-border)] bg-[var(--chat-panel-bg)]"
          style={{ width: "var(--chat-panel-width)" }}
        >
          <ActiveChatScreen
            documentId={documentId}
            documentTitle={documentTitle}
            layout="panel"
            onCitationSelect={setActiveCitation}
            onThinkingChange={handleThinkingChange}
          />
        </section>
      </div>
    </>
  );
}
