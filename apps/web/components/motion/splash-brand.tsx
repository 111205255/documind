"use client";

import { motion } from "framer-motion";
import { DocumentIcon } from "@/components/brand/icons";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Figma frame 01 — animated splash branding */
export function SplashBrand() {
  const reduced = useReducedMotion();

  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, damping: 22, stiffness: 280 };

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.82, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={spring}
        className="flex items-center justify-center rounded-[var(--logo-radius)] bg-white/20 text-white shadow-[var(--logo-shadow)]"
        style={{ width: "var(--logo-size-lg)", height: "var(--logo-size-lg)" }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <DocumentIcon className="h-11 w-11" />
        </motion.div>
      </motion.div>

      <motion.h1
        className="mt-6 text-[2rem] font-bold tracking-tight"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: reduced ? 0 : 0.12 }}
      >
        {APP_NAME}
      </motion.h1>

      <motion.p
        className="mt-2 max-w-xs text-sm font-normal text-white/85"
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: reduced ? 0 : 0.22 }}
      >
        {APP_TAGLINE}
      </motion.p>
    </div>
  );
}
