"use client";

import { AppSidebar } from "./app-sidebar";
import { BottomNav } from "./bottom-nav";
import { UploadModal } from "@/features/documents/components/upload-modal";
import { UploadModalProvider } from "@/context/upload-modal-context";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Figma frames 04–15: sidebar + main canvas.
 * Uses CSS breakpoints (lg) — no JS media-query flash on load.
 */
export function DashboardShell({
  children,
  fullWidth,
  wideContent,
}: {
  children: ReactNode;
  fullWidth?: boolean;
  /** Home grid uses full padded width */
  wideContent?: boolean;
}) {
  return (
    <UploadModalProvider>
      {/* Mobile — frames use bottom nav below lg */}
      <div className="flex min-h-dvh flex-col bg-[var(--surface-base)] lg:hidden">
        <main className="flex-1 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))]">
          <div className="mx-auto w-full max-w-[var(--mobile-max-width)] px-[var(--space-4)] py-[var(--space-4)]">
            {children}
          </div>
        </main>
        <BottomNav />
        <UploadModal />
      </div>

      {/* Desktop — persistent sidebar + main */}
      <div className="hidden h-dvh bg-[var(--dashboard-main-bg)] lg:flex">
        <AppSidebar />
        <main
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            fullWidth ? "overflow-hidden" : "overflow-y-auto p-[var(--dashboard-main-padding)]",
          )}
        >
          {fullWidth ? (
            children
          ) : (
            <div
              className={cn(
                "mx-auto w-full flex-1",
                wideContent ? "max-w-none" : "max-w-[var(--dashboard-content-max)]",
              )}
            >
              {children}
            </div>
          )}
        </main>
        <UploadModal />
      </div>
    </UploadModalProvider>
  );
}
