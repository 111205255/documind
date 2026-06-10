import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-[var(--radius-md)] bg-[var(--surface-sunken)]",
        className,
      )}
      style={style}
      aria-hidden
    />
  );
}
