"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AppLogo } from "@/components/brand/app-logo";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUploadModal } from "@/context/upload-modal-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const NAV = [
  { href: ROUTES.home, label: "Home", match: (p: string) => p === ROUTES.home || p.startsWith("/documents") },
  { href: ROUTES.chat, label: "Chats", match: (p: string) => p.startsWith("/chat") && p !== ROUTES.chatHistory },
  { href: ROUTES.chatHistory, label: "History", match: (p: string) => p === ROUTES.chatHistory },
  { href: ROUTES.settings, label: "Settings", match: (p: string) => p === ROUTES.settings },
] as const;

function NavIcon({ label }: { label: string }) {
  const paths: Record<string, string> = {
    Home: "M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    Chats: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z",
    History: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    Settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm8.5-3.5 1.7.3a1 1 0 0 1 .55 1.7l-1.2 1.2.3 1.7a1 1 0 0 1-1.45 1.05L12 17.25l-1.55.8a1 1 0 0 1-1.45-1.05l.3-1.7-1.2-1.2a1 1 0 0 1 .55-1.7l1.7-.3.8-1.55a1 1 0 0 1 1.8 0l.8 1.55z",
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d={paths[label] ?? paths.Home} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Figma frames 04–15 — left navigation rail */
export function AppSidebar() {
  const pathname = usePathname();
  const { openUpload } = useUploadModal();
  const { email, initials } = useCurrentUser();
  const reducedMotion = useReducedMotion();

  return (
    <aside
      data-testid="app-sidebar"
      className="flex h-full w-[var(--sidebar-width)] shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] px-[var(--sidebar-padding-x)] py-[var(--sidebar-padding-y)]"
    >
      <Link
        href={ROUTES.home}
        className="hover-lift mb-8 flex items-center gap-3 rounded-[var(--radius-lg)]"
      >
        <AppLogo size="md" className="!h-10 !w-10 [&_svg]:!h-[18px] [&_svg]:!w-[18px]" />
        <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{APP_NAME}</span>
      </Link>

      <motion.button
        type="button"
        onClick={openUpload}
        whileHover={reducedMotion ? undefined : { scale: 1.01, y: -1 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", damping: 26, stiffness: 420 }}
        className="interaction-press mb-8 flex w-full items-center justify-center gap-2 rounded-[var(--radius-xl)] bg-[var(--brand-primary)] text-sm font-semibold text-white shadow-[var(--doc-fab-shadow)] hover:bg-[var(--brand-primary-hover)]"
        style={{ height: "var(--sidebar-upload-height)" }}
        data-testid="sidebar-upload-btn"
      >
        <span className="text-lg leading-none">+</span>
        Upload document
      </motion.button>

      <nav className="flex flex-1 flex-col gap-1.5" aria-label="Main">
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`sidebar-nav-${item.label.toLowerCase()}`}
              data-active={active ? "true" : "false"}
              className={cn(
                "interaction-press group relative flex items-center gap-3 rounded-[var(--radius-lg)] px-3 text-sm font-medium transition-colors duration-[var(--duration-fast)]",
                active
                  ? "text-[var(--sidebar-active-text)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text-primary)]",
              )}
              style={{ height: "var(--sidebar-nav-height)" }}
            >
              {active ? (
                <span
                  className="absolute inset-0 rounded-[var(--radius-lg)] bg-[var(--sidebar-active-bg)]"
                  aria-hidden
                />
              ) : null}
              <span className="relative z-10 flex items-center gap-3">
                <NavIcon label={item.label} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold capitalize text-[var(--text-primary)]">
              {email?.split("@")[0] ?? "Account"}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">Free plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
