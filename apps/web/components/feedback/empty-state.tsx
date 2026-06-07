import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  illustration?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  illustration,
  action,
  className,
}: EmptyStateProps) {
  return (
    <FadeIn className={cn("flex flex-col items-center py-12 text-center", className)}>
      {illustration ? (
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-[var(--radius-2xl)] bg-[var(--surface-sunken)] text-[var(--text-tertiary)]">
          {illustration}
        </div>
      ) : null}
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-xs text-sm text-[var(--text-secondary)]">{description}</p>
      ) : null}
      {action ? <div className="mt-6 w-full max-w-xs">{action}</div> : null}
    </FadeIn>
  );
}
