"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./app-shell";
import type { ReactNode } from "react";

const FULL_BLEED_ROUTES = ["/home"];
const HIDE_NAV_PREFIXES = ["/home", "/documents"];

export function MainAppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullBleed = FULL_BLEED_ROUTES.includes(pathname);
  const hideNav = HIDE_NAV_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  return (
    <AppShell hideNav={hideNav} fullBleed={fullBleed}>
      {children}
    </AppShell>
  );
}
