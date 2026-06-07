"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 shadow-[var(--shadow-sm)]",
        interactive &&
          "cursor-pointer transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] active:translate-y-0 active:shadow-[var(--shadow-md)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

Card.displayName = "Card";
