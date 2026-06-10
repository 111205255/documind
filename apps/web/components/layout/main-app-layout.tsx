"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "./dashboard-shell";
import { ROUTES } from "@/lib/constants";
import type { ReactNode } from "react";

/** Only active chat uses full-bleed 3-panel layout (frames 07–10). */
export function MainAppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullWidth = pathname.startsWith("/chat/") && pathname !== ROUTES.chatHistory;
  const wideContent = pathname === ROUTES.home;

  return (
    <DashboardShell fullWidth={fullWidth} wideContent={wideContent}>
      {children}
    </DashboardShell>
  );
}
