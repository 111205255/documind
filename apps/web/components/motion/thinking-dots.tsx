import { cn } from "@/lib/utils";

export function ThinkingDots({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="status"
      aria-label="AI is thinking"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="animate-thinking-dot h-2 w-2 rounded-full bg-[var(--text-tertiary)]"
        />
      ))}
    </span>
  );
}
