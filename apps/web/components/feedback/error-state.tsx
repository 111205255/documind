"use client";

import { motion } from "framer-motion";
import { WarningIcon } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Figma frame 15 */
export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't process that request. Please check your connection and try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center"
      data-testid="error-state"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="mb-8 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.25rem] bg-[var(--citation-bg)] text-[var(--brand-primary)]"
        animate={reduced ? undefined : { rotate: [0, -4, 4, -2, 0] }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <WarningIcon />
      </motion.div>
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{message}</p>
      {onRetry ? (
        <Button className="mt-10 !h-12 min-w-[10rem] px-8" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </motion.div>
  );
}
