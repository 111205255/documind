import { Easing, withTiming, type WithTimingConfig } from "react-native-reanimated";
import { MotionDuration, MotionEasing } from "../theme/motion";

const bezierStandard = Easing.bezier(
  MotionEasing.standard[0],
  MotionEasing.standard[1],
  MotionEasing.standard[2],
  MotionEasing.standard[3],
);

const bezierDecelerate = Easing.bezier(
  MotionEasing.decelerate[0],
  MotionEasing.decelerate[1],
  MotionEasing.decelerate[2],
  MotionEasing.decelerate[3],
);

export function timing(
  duration: number = MotionDuration.normal,
  easing = bezierStandard,
): WithTimingConfig {
  return { duration, easing };
}

export function timingDecelerate(duration: number = MotionDuration.normal): WithTimingConfig {
  return { duration, easing: bezierDecelerate };
}

/** Cap stagger so long lists don't cascade */
export function staggerDelay(index: number, step: number, base = 0): number {
  return base + Math.min(index, 5) * step;
}
