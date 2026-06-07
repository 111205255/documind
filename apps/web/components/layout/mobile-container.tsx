import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function MobileContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--mobile-max-width)] px-4 md:max-w-2xl md:px-6 lg:max-w-4xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
