import type { ReactNode } from "react";

/** Soft corner glows — Figma frames 01 & 02 */
export function AuthGradientBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh flex-1 overflow-hidden bg-[var(--auth-bg)]">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "var(--auth-glow-a)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "var(--auth-glow-b)" }}
        aria-hidden
      />
      <div className="relative z-10 flex min-h-dvh flex-1 flex-col">{children}</div>
    </div>
  );
}
