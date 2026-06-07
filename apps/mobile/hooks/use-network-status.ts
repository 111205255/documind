import * as Network from "expo-network";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export function useNetworkStatus(): { online: boolean; checked: boolean } {
  const [online, setOnline] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        if (Platform.OS === "web" && typeof navigator !== "undefined") {
          if (!cancelled) {
            setOnline(navigator.onLine);
            setChecked(true);
          }
          return;
        }
        const state = await Network.getNetworkStateAsync();
        if (!cancelled) {
          setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
          setChecked(true);
        }
      } catch {
        if (!cancelled) {
          setOnline(true);
          setChecked(true);
        }
      }
    };

    void refresh();
    const interval = setInterval(() => void refresh(), 5000);

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const onOnline = () => setOnline(true);
      const onOffline = () => setOnline(false);
      window.addEventListener("online", onOnline);
      window.addEventListener("offline", onOffline);
      return () => {
        cancelled = true;
        clearInterval(interval);
        window.removeEventListener("online", onOnline);
        window.removeEventListener("offline", onOffline);
      };
    }

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { online, checked };
}
