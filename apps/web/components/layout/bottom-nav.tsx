"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function NavIcon({ icon, active }: { icon: (typeof NAV_ITEMS)[number]["icon"]; active: boolean }) {
  const stroke = active ? "var(--brand-primary)" : "var(--text-tertiary)";

  const paths: Record<(typeof NAV_ITEMS)[number]["icon"], ReactNode> = {
    documents: (
      <path
        d="M6 4h12v16H6V4zm2 2v12h8V6H8zm2 2h4v2h-4V8zm0 4h4v2h-4v-2z"
        fill={stroke}
      />
    ),
    chat: (
      <path
        d="M5 6a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H9l-4 3v-3H7a2 2 0 01-2-2V6z"
        fill={stroke}
      />
    ),
    settings: (
      <path
        d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm8.4 4.2l1.4 1.2-1.3 2.3-1.7-.3-.9 1.5-2-.9.5 1.6-2.2 1.2-.9-1.5-1.7.3-1.3-2.3 1.4-1.2-.5-1.6 2-.9.9-1.5 1.7.3 1.3-2.3-1.4-1.2.5-1.6 2.2-1.2.9 1.5 1.7-.3 1.3 2.3-1.4 1.2.5 1.6-2 .9-.9 1.5z"
        fill={stroke}
      />
    ),
  };

  return (
    <motion.span
      className="flex h-6 w-6 items-center justify-center"
      animate={active ? { scale: 1.08, y: -2 } : { scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 380 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className={active ? "animate-icon-pop" : ""}>
        {paths[icon]}
      </svg>
    </motion.span>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-default)] bg-[var(--surface-overlay)] backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main navigation"
      data-testid="bottom-nav"
    >
      <div className="mx-auto flex h-[var(--bottom-nav-height)] max-w-[var(--mobile-max-width)] items-stretch justify-around md:max-w-2xl lg:max-w-4xl">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`bottom-nav-${item.icon}`}
              data-active={active ? "true" : "false"}
              className={cn(
                "interaction-press relative flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors duration-[var(--duration-fast)]",
                active ? "text-[var(--brand-primary)]" : "text-[var(--text-tertiary)]",
              )}
            >
              {active && !reducedMotion ? (
                <motion.span
                  layoutId="bottom-nav-indicator"
                  className="absolute top-1 h-1 w-8 rounded-full bg-[var(--brand-primary)]"
                  transition={{ type: "spring", damping: 26, stiffness: 400 }}
                />
              ) : active ? (
                <span className="absolute top-1 h-1 w-8 rounded-full bg-[var(--brand-primary)]" />
              ) : null}
              <NavIcon icon={item.icon} active={active} />
              <span className={active ? "font-semibold" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
