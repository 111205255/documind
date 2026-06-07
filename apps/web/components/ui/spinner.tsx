import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
} as const;

export function Spinner({
  size = "md",
  className,
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-[var(--border-strong)] border-t-[var(--brand-primary)]",
        sizes[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
