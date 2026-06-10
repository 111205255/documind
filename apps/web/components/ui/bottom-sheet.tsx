"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
}: BottomSheetProps) {
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
    : { type: "spring" as const, damping: 28, stiffness: 320 };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.button
            type="button"
            aria-label="Close sheet"
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "sheet-title" : undefined}
            className={cn(
              "relative z-10 w-full max-w-[var(--mobile-max-width)] rounded-t-[var(--sheet-radius)]",
              "border border-[var(--border-default)] bg-[var(--surface-raised)] shadow-[var(--shadow-lg)]",
              "max-h-[85vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]",
              className,
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={transition}
          >
            <div className="flex justify-center py-3">
              <span className="h-1 w-10 rounded-full bg-[var(--border-strong)]" aria-hidden />
            </div>
            {title || subtitle ? (
              <div className="px-4 pb-3">
                {title ? (
                  <h2
                    id="sheet-title"
                    className="text-lg font-bold text-[var(--text-primary)]"
                  >
                    {title}
                  </h2>
                ) : null}
                {subtitle ? (
                  <p className="mt-0.5 text-sm font-medium text-[var(--brand-primary)]">{subtitle}</p>
                ) : null}
              </div>
            ) : null}
            <div className="px-4 pb-6">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
