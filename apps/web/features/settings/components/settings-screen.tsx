"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  BellIcon,
  ChevronRightIcon,
  HelpIcon,
  LockIcon,
  LogoutIcon,
  MoonIcon,
} from "@/components/brand/icons";
import { AnimatedToggle } from "@/components/ui/animated-toggle";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/services/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";

/** Figma frame 13 */
export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { email, displayName, initials } = useCurrentUser();
  const reducedMotion = useReducedMotion();
  const [displayEmail, setDisplayEmail] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    void createClient()
      .auth.getUser()
      .then(({ data }) => setDisplayEmail(data.user?.email ?? email));
    const saved = localStorage.getItem("documind-notifications");
    if (saved !== null) setNotifications(saved === "true");
  }, [email]);

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push(ROUTES.login);
    router.refresh();
  };

  const isDark = theme === "dark";

  return (
    <div data-testid="settings-screen" className="figma-content-stack">
      <FadeIn>
        <h1 className="figma-page-title m-0">Settings</h1>
      </FadeIn>

      <StaggerList style={{ gap: "var(--settings-card-gap)" }} className="flex flex-col">
        <StaggerItem>
          <motion.div
            whileHover={reducedMotion ? undefined : { y: -2 }}
            transition={{ type: "spring", damping: 28, stiffness: 400 }}
            className="figma-surface-card w-fit max-w-full p-5 pr-8 transition-shadow duration-[var(--duration-normal)] hover:shadow-[var(--shadow-sm)]"
            data-testid="settings-profile-card"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-lg font-bold text-white"
                style={{
                  width: "var(--settings-avatar-size)",
                  height: "var(--settings-avatar-size)",
                }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold text-[var(--text-primary)]">
                  {displayName}
                </p>
                <p className="figma-meta truncate">{displayEmail ?? "Not signed in"}</p>
              </div>
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <div className="figma-surface-card overflow-hidden" data-testid="settings-card">
            <div
              className="flex items-center justify-between border-b border-[var(--border-default)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--surface-sunken)]"
              style={{
                paddingBlock: "var(--settings-row-padding-y)",
                paddingInline: "var(--settings-row-padding-x)",
              }}
            >
              <span className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)]">
                <BellIcon className="text-[var(--text-secondary)]" />
                Notifications
              </span>
              <AnimatedToggle
                label="Notifications"
                checked={notifications}
                onChange={(v) => {
                  setNotifications(v);
                  localStorage.setItem("documind-notifications", String(v));
                }}
              />
            </div>
            <div
              className="flex items-center justify-between transition-colors duration-[var(--duration-fast)] hover:bg-[var(--surface-sunken)]"
              style={{
                paddingBlock: "var(--settings-row-padding-y)",
                paddingInline: "var(--settings-row-padding-x)",
              }}
            >
              <span className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)]">
                <MoonIcon className="text-[var(--text-secondary)]" />
                Dark mode
              </span>
              <AnimatedToggle
                label="Dark mode"
                checked={isDark}
                onChange={(v) => setTheme(v ? "dark" : "light")}
              />
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="figma-surface-card overflow-hidden" data-testid="settings-card">
            <Link href="/terms" className="figma-action-row group">
              <span className="flex items-center gap-3">
                <LockIcon className="text-[var(--text-secondary)]" />
                Privacy & security
              </span>
              <ChevronRightIcon className="figma-settings-chevron" />
            </Link>
            <a href="mailto:support@documind.app" className="figma-action-row group">
              <span className="flex items-center gap-3">
                <HelpIcon className="text-[var(--text-secondary)]" />
                Help & support
              </span>
              <ChevronRightIcon className="figma-settings-chevron" />
            </a>
          </div>
        </StaggerItem>

        <StaggerItem>
          <motion.button
            type="button"
            onClick={() => void signOut()}
            whileHover={reducedMotion ? undefined : { y: -1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.99 }}
            transition={{ type: "spring", damping: 28, stiffness: 420 }}
            data-testid="settings-card"
            className="interaction-press figma-surface-card figma-action-row figma-action-row--destructive w-full transition-shadow duration-[var(--duration-normal)] hover:shadow-[var(--shadow-sm)]"
          >
            <span className="flex items-center gap-3">
              <LogoutIcon />
              Sign out
            </span>
          </motion.button>
        </StaggerItem>
      </StaggerList>

      <FadeIn delay={0.2}>
        <p className="figma-caption mt-2">DocuMind v1.0.0</p>
      </FadeIn>
    </div>
  );
}
