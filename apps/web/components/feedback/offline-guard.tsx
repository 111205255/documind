"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/lib/constants";

const OFFLINE_RETURN_KEY = "documind-offline-return";

/** Redirect to /offline when the browser loses network (Blueprint frame 15). */
export function OfflineGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const goOffline = () => {
      if (pathname !== ROUTES.offline && pathname !== ROUTES.login) {
        sessionStorage.setItem(OFFLINE_RETURN_KEY, pathname);
        router.replace(ROUTES.offline);
      }
    };

    const goOnline = () => {
      if (pathname === ROUTES.offline) {
        const returnPath = sessionStorage.getItem(OFFLINE_RETURN_KEY) || ROUTES.home;
        sessionStorage.removeItem(OFFLINE_RETURN_KEY);
        router.replace(returnPath);
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
