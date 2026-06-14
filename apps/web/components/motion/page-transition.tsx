"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -4 }}
      transition={{
        duration: reduced ? 0 : 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedPageShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // The active-chat split view fills the full-bleed canvas, so its transition
  // wrapper must participate in the flex height chain — otherwise `h-full`/
  // `flex-1` collapse to content height, leaving a large empty area.
  const isFullBleed =
    pathname === ROUTES.chat ||
    (pathname.startsWith("/chat/") && pathname !== ROUTES.chatHistory);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition
        key={reduced ? "static" : pathname}
        className={cn(isFullBleed && "flex min-h-0 w-full flex-1 flex-col")}
      >
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}
