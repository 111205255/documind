"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/lib/constants";

/** Redirect to /offline when the browser loses network (Blueprint frame 15). */
export function OfflineGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const goOffline = () => {
      if (pathname !== ROUTES.offline && pathname !== ROUTES.login) {
        router.replace(ROUTES.offline);
      }
    };

    const goOnline = () => {
      if (pathname === ROUTES.offline) {
        router.replace(ROUTES.home);
      }
    };

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      goOffline();
    }

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [pathname, router]);

  return children;
}
