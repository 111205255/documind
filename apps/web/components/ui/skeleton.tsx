import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-[var(--radius-md)] bg-[var(--surface-sunken)]",
        className,
      )}
      aria-hidden
    />
  );
}
