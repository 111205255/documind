/**
 * Apple-inspired motion tokens (iOS Human Interface Guidelines).
 * Springs are critically damped — responsive, never playful/bouncy.
 */

export const MotionDuration = {
  instant: 80,
  tap: 100,
  fast: 180,
  normal: 250,
  sheet: 380,
  slow: 520,
  thinking: 1400,
} as const;

/** iOS standard ease-out (UIView animation curve) */
export const MotionEasing = {
  standard: [0.25, 0.1, 0.25, 1] as const,
  decelerate: [0, 0, 0.2, 1] as const,
  accelerate: [0.4, 0, 1, 1] as const,
} as const;

export const MotionScale = {
  button: 0.96,
  card: 0.985,
  chip: 0.97,
} as const;

export const MotionOpacity = {
  pressed: 0.82,
  dimmed: 0.6,
} as const;

/** Reanimated spring presets — overshootClamping for UI surfaces */
export const Spring = {
  /** Button press — snappy, no bounce */
  press: { damping: 26, stiffness: 520, mass: 0.35, overshootClamping: true },
  /** Cards, chips */
  surface: { damping: 28, stiffness: 380, mass: 0.45, overshootClamping: true },
  /** Bottom sheet settle */
  sheet: { damping: 32, stiffness: 340, mass: 0.7, overshootClamping: true },
  /** Gentle content reveal */
  reveal: { damping: 30, stiffness: 280, mass: 0.55, overshootClamping: true },
  /** Hero / empty-state entrance */
  hero: { damping: 32, stiffness: 240, mass: 0.65, overshootClamping: true },
  /** Idle loops — soft, no snap */
  idle: { damping: 42, stiffness: 140, mass: 0.75, overshootClamping: true },
  /** Sheet snap-back after drag */
  snap: { damping: 34, stiffness: 420, mass: 0.65, overshootClamping: true },
} as const;

/** List / message stagger — keep under ~120ms total */
export const Stagger = {
  list: 22,
  message: 28,
  chip: 24,
  maxIndex: 5,
} as const;

/** Bottom sheet gesture */
export const SheetGesture = {
  dismissDistance: 88,
  dismissVelocity: 720,
  rubberBandFactor: 0.55,
} as const;
