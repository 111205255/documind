"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StaggerList({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: reduced ? {} : { staggerChildren: 0.08 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: reduced ? {} : { opacity: 0, y: 12 },
        visible: reduced
          ? {}
          : {
              opacity: 1,
              y: 0,
              transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            },
      }}
    >
      {children}
    </motion.div>
  );
}
