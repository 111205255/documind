"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { OfflineGuard } from "@/components/feedback/offline-guard";
import { PwaRegister } from "@/components/pwa-register";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PwaRegister />
      <OfflineGuard>{children}</OfflineGuard>
    </ThemeProvider>
  );
}
