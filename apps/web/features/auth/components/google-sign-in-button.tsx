"use client";

import { GoogleIcon } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

export function GoogleSignInButton({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[3.25rem] w-full items-center justify-center gap-3 rounded-[var(--radius-auth-button)]",
        "border border-[var(--auth-button-border)] bg-[var(--auth-button-bg)]",
        "text-base font-semibold text-[var(--auth-button-text)] shadow-[var(--auth-button-shadow)]",
        "transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
        "hover:brightness-[0.98] active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]",
        "dark:hover:brightness-110",
        className,
      )}
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}
