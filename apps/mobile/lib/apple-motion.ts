import { Easing, withRepeat, withTiming } from "react-native-reanimated";

/** One phase 0↔1 — all idle motion stays in sync (Apple empty-state style) */
export const APPLE_IDLE_MS = 3800;

export function appleIdlePhase() {
  return withRepeat(
    withTiming(1, {
      duration: APPLE_IDLE_MS / 2,
      easing: Easing.inOut(Easing.sin),
    }),
    -1,
    true,
  );
}

/** Single smooth hump per half-cycle (0 at ends, peak at 0.5) */
export function appleIdleCurve(p: number): number {
  "worklet";
  return Math.sin(p * Math.PI);
}

/** Layered wave with phase offset — parallax between glow / icon / shadow */
export function appleWave(p: number, amplitude: number, phaseShift = 0): number {
  "worklet";
  const t = ((p + phaseShift) % 1 + 1) % 1;
  return (appleIdleCurve(t) * 2 - 1) * amplitude;
}
