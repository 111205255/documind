import { cn } from "@/lib/utils";

/** Send-button sparkle while AI thinks (Figma frame 10) */
export function ThinkingSparkle({ active, className }: { active: boolean; className?: string }) {
  if (!active) {
    return (
      <span className={cn("text-lg leading-none", className)} aria-hidden>
        ✦
      </span>
    );
  }

  return (
    <span className={cn("relative flex h-5 w-5 items-center justify-center", className)} aria-hidden>
      <span className="animate-thinking-ripple absolute h-7 w-7 rounded-full border border-white/40" />
      <span className="animate-thinking-ripple-delayed absolute h-6 w-6 rounded-full border border-white/25" />
      <span className="animate-thinking-orbit absolute h-1 w-1 rounded-full bg-white/90" />
      <span className="animate-thinking-orbit-delay-1 absolute h-1 w-1 rounded-full bg-white/75" />
      <span className="animate-thinking-orbit-delay-2 absolute h-1 w-1 rounded-full bg-white/60" />
      <span className="animate-thinking-sparkle text-lg leading-none text-white">✦</span>
    </span>
  );
}
