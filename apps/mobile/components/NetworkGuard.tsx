import { useRouter, useSegments } from "expo-router";
import { useEffect, type ReactNode } from "react";
import { useNetworkStatus } from "../hooks/use-network-status";

/** Redirect to /connection when device is offline (Blueprint frame 15). */
export function NetworkGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { online, checked } = useNetworkStatus();

  const onConnectionScreen = segments[0] === "connection";
  const onAuthScreen =
    segments[0] === "login" || segments[0] === "auth" || segments.length === 0;

  useEffect(() => {
    if (!checked) return;
    if (!online && !onConnectionScreen && !onAuthScreen) {
      router.replace("/connection");
      return;
    }
    if (online && onConnectionScreen) {
      router.back();
    }
  }, [online, checked, onConnectionScreen, onAuthScreen, router]);

  return children;
}
