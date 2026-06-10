"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const transition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, damping: 28, stiffness: 340 };

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          data-testid="modal-overlay"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-[var(--modal-overlay)]"
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            className={cn(
              "relative z-10 w-full max-w-md rounded-[var(--radius-2xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] shadow-[var(--shadow-lg)]",
              className,
            )}
            style={{ padding: "var(--modal-padding)" }}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={transition}
            data-testid="modal-panel"
          >
            {(title || subtitle) && (
              <div
                className="flex items-center justify-between gap-3"
                style={{ marginBottom: "var(--modal-header-gap)" }}
              >
                <div className="min-w-0 flex-1">
                  {title ? (
                    <h2 id="modal-title" className="text-lg font-bold leading-tight text-[var(--text-primary)]">
                      {title}
                    </h2>
                  ) : null}
                  {subtitle ? (
                    <p className="mt-1 text-sm leading-snug text-[var(--text-secondary)]">{subtitle}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="interaction-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-sunken)] text-lg leading-none text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
