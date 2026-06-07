import type { ReactNode } from "react";

/** Shared gradient canvas — frames 03 & 04 (matches auth marketing screens) */
export function DocumentsPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh flex-1 bg-[var(--doc-page-bg)]">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "var(--auth-glow-a)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "var(--auth-glow-b)" }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[var(--mobile-max-width)] flex-col px-6 pb-28 pt-14">
        {children}
      </div>
    </div>
  );
}
