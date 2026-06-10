"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { ROUTES } from "@/lib/constants";
import { createClient } from "@/services/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";

/** Figma frame 13 */
export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { email, initials } = useCurrentUser();
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

  const displayName = displayEmail?.split("@")[0] ?? "Account";
  const isDark = theme === "dark";

  return (
    <div data-testid="settings-screen" className="figma-content-stack">
      <FadeIn>
        <h1 className="figma-page-title m-0">Settings</h1>
      </FadeIn>

      <StaggerList style={{ gap: "var(--settings-card-gap)" }} className="flex flex-col">
        <StaggerItem>
          <div className="figma-surface-card p-5" data-testid="settings-card">
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
                <p className="text-base font-semibold capitalize text-[var(--text-primary)]">
                  {displayName}
                </p>
                <p className="figma-meta truncate">{displayEmail ?? "Not signed in"}</p>
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="figma-surface-card overflow-hidden" data-testid="settings-card">
            <div
              className="flex items-center justify-between border-b border-[var(--border-default)]"
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
              className="flex items-center justify-between"
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
            <Link
              href="/terms"
              className="hover-lift flex items-center justify-between border-b border-[var(--border-default)] transition-colors hover:bg-[var(--surface-sunken)]"
              style={{
                paddingBlock: "var(--settings-row-padding-y)",
                paddingInline: "var(--settings-row-padding-x)",
              }}
            >
              <span className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)]">
                <LockIcon className="text-[var(--text-secondary)]" />
                Privacy & security
              </span>
              <ChevronRightIcon className="text-[var(--text-tertiary)]" />
            </Link>
            <a
              href="mailto:support@documind.app"
              className="hover-lift flex items-center justify-between transition-colors hover:bg-[var(--surface-sunken)]"
              style={{
                paddingBlock: "var(--settings-row-padding-y)",
                paddingInline: "var(--settings-row-padding-x)",
              }}
            >
              <span className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)]">
                <HelpIcon className="text-[var(--text-secondary)]" />
                Help & support
              </span>
              <ChevronRightIcon className="text-[var(--text-tertiary)]" />
            </a>
          </div>
        </StaggerItem>

        <StaggerItem>
          <button
            type="button"
            onClick={() => void signOut()}
            data-testid="settings-card"
            className="interaction-press figma-surface-card flex w-full items-center gap-3 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:bg-[var(--surface-sunken)]"
            style={{
              paddingBlock: "var(--settings-row-padding-y)",
              paddingInline: "var(--settings-row-padding-x)",
            }}
          >
            <LogoutIcon />
            Sign out
          </button>
        </StaggerItem>
      </StaggerList>

      <p className="figma-caption mt-2">DocuMind v1.0.0</p>
    </div>
  );
}
