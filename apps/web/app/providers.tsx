"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { OfflineGuard } from "@/components/feedback/offline-guard";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <OfflineGuard>{children}</OfflineGuard>
    </ThemeProvider>
  );
}
