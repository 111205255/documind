import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backHref?: string;
  className?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  action,
  className,
}: ScreenHeaderProps) {
  return (
    <header
      className={cn(
        "flex min-h-[var(--header-height)] items-center justify-between gap-3 py-2",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-semibold text-[var(--text-primary)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="truncate text-sm text-[var(--text-secondary)]">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
