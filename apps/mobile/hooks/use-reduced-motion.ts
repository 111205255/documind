import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** True when system "Reduce Motion" is on */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduced(enabled);
      })
      .catch(() => {
        if (mounted) setReduced(false);
      });

    const sub = AccessibilityInfo.addEventListener?.(
      "reduceMotionChanged",
      (enabled) => {
        if (mounted) setReduced(enabled);
      },
    );

    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  return reduced;
}

/** Animations allowed (resolved accessibility + user preference) */
export function useMotionEnabled(): boolean {
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .finally(() => setReady(true));
  }, []);

  return ready && !reduced;
}
