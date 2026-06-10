"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChatBubbleIcon } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { FloatingIcon } from "@/components/motion/floating-icon";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ROUTES } from "@/lib/constants";

/** Figma frame 07 — chat empty (no document selected) */
export function ChatEmptyScreen() {
  const reducedMotion = useReducedMotion();

  return (
    <StaggerList className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <StaggerItem>
        <FloatingIcon>
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--doc-empty-icon-bg)] text-[var(--brand-primary)] shadow-[var(--doc-empty-icon-shadow)]">
            <ChatBubbleIcon className="h-8 w-8" />
          </div>
        </FloatingIcon>
      </StaggerItem>
      <StaggerItem>
        <h1 className="figma-section-title">Start the conversation</h1>
      </StaggerItem>
      <StaggerItem>
        <p className="figma-meta mt-3 max-w-sm text-base leading-relaxed">
          Select a document from Home or upload a new one to begin chatting with citations.
        </p>
      </StaggerItem>
      <StaggerItem>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <motion.div
            whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 420 }}
          >
            <Link href={ROUTES.home}>
              <Button>Browse documents</Button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 420 }}
          >
            <Link href={ROUTES.chatHistory}>
              <Button variant="secondary">Chat history</Button>
            </Link>
          </motion.div>
        </div>
      </StaggerItem>
    </StaggerList>
  );
}
