import { BottomNav } from "./bottom-nav";
import { MobileContainer } from "./mobile-container";
import type { ReactNode } from "react";

export function AppShell({
  children,
  hideNav,
  fullBleed,
}: {
  children: ReactNode;
  hideNav?: boolean;
  fullBleed?: boolean;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--surface-base)]">
      <main
        className={
          hideNav
            ? "flex-1"
            : "flex-1 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))]"
        }
      >
        {fullBleed ? (
          children
        ) : (
          <MobileContainer className="py-4">{children}</MobileContainer>
        )}
      </main>
      {!hideNav ? <BottomNav /> : null}
    </div>
  );
}
