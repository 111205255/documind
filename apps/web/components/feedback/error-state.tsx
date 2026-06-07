import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Please check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <FadeIn className="flex flex-col items-center py-16 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--error)]/10 text-2xl"
        aria-hidden
      >
        !
      </div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">{message}</p>
      {onRetry ? (
        <Button className="mt-6" onClick={onRetry} variant="secondary">
          Try again
        </Button>
      ) : null}
    </FadeIn>
  );
}
