"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const variants = {
  primary:
    "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-pressed)] shadow-sm",
  secondary:
    "bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-sunken)] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-sunken)] active:bg-[var(--border-default)]",
  destructive:
    "bg-[var(--error)] text-white hover:opacity-90 active:opacity-80",
} as const;

const sizes = {
  sm: "h-9 px-3 text-sm gap-1.5 rounded-[var(--radius-md)]",
  md: "h-11 px-4 text-sm gap-2 rounded-[var(--radius-lg)]",
  lg: "h-12 px-6 text-base gap-2 rounded-[var(--radius-lg)]",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      fullWidth,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "interaction-press inline-flex items-center justify-center font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98]",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size="sm" className="border-white/30 border-t-white" /> : null}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
