"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { AppLogo } from "@/components/brand/app-logo";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUploadModal } from "@/context/upload-modal-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

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
    <span className="figma-sidebar-nav-icon" aria-hidden>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d={paths[label] ?? paths.Home} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** Figma frame 04 — Sidebar 260×1024, inset 24px, children 212×44 */
export function AppSidebar() {
  const pathname = usePathname();
  const { openUpload } = useUploadModal();
  const { email, initials } = useCurrentUser();
  const reducedMotion = useReducedMotion();

  return (
    <aside data-testid="app-sidebar" className="figma-sidebar">
      <Link href={ROUTES.home} className="figma-sidebar-brand hover-lift">
        <AppLogo
          size="md"
          className="!h-8 !w-8 shrink-0 [&_svg]:!h-[18px] [&_svg]:!w-[18px]"
        />
        <span className="text-lg font-bold leading-none tracking-tight text-[var(--text-primary)]">
          {APP_NAME}
        </span>
      </Link>

      <motion.button
        type="button"
        onClick={openUpload}
        whileHover={reducedMotion ? undefined : { scale: 1.01 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", damping: 26, stiffness: 420 }}
        className="figma-sidebar-upload interaction-press hover-brand-glow"
        data-testid="sidebar-upload-btn"
      >
        <span className="text-base leading-none">+</span>
        Upload document
      </motion.button>

      <LayoutGroup>
        <nav className="figma-sidebar-nav" aria-label="Main">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`sidebar-nav-${item.label.toLowerCase()}`}
                data-active={active ? "true" : "false"}
                className="figma-sidebar-nav-item interaction-press"
              >
                {active ? (
                  reducedMotion ? (
                    <span className="figma-sidebar-nav-pill" aria-hidden />
                  ) : (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="figma-sidebar-nav-pill"
                      aria-hidden
                      transition={{ type: "spring", damping: 26, stiffness: 400 }}
                    />
                  )
                ) : null}
                <span className="figma-sidebar-nav-content">
                  <NavIcon label={item.label} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>

      <div className="figma-sidebar-footer">
        <motion.div
          data-testid="sidebar-user-card"
          whileHover={reducedMotion ? undefined : { y: -1 }}
          transition={{ type: "spring", damping: 28, stiffness: 400 }}
          className="figma-sidebar-user-card transition-shadow duration-[var(--duration-normal)] hover:shadow-[var(--shadow-md)]"
        >
          <div className="figma-sidebar-user-inner">
            <div className="figma-sidebar-user-avatar">{initials}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold capitalize text-[var(--text-primary)]">
                {email?.split("@")[0] ?? "Account"}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">Free plan</p>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
