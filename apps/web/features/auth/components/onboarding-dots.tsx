import { cn } from "@/lib/utils";

export function OnboardingDots({
  total = 3,
  active = 0,
  className,
}: {
  total?: number;
  active?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      role="tablist"
      aria-label="Onboarding progress"
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          role="tab"
          aria-selected={i === active}
          className={cn(
            "h-2 w-2 rounded-full transition-colors duration-[var(--duration-normal)]",
            i === active ? "bg-[var(--brand-primary)]" : "bg-[var(--auth-dot-inactive)]",
          )}
        />
      ))}
    </div>
  );
}
