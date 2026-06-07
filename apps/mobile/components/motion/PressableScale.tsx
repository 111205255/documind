import { type ReactNode } from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { hapticLight, hapticMedium, hapticSelection, hapticSuccess } from "../../lib/haptics";
import { timing } from "../../lib/motion";
import { MotionDuration, MotionOpacity, MotionScale, Spring } from "../../theme/motion";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type HapticKind = "light" | "medium" | "selection" | "success" | false;
type Variant = "button" | "card" | "chip";

const VARIANT_SCALE: Record<Variant, number> = {
  button: MotionScale.button,
  card: MotionScale.card,
  chip: MotionScale.chip,
};

export function PressableScale({
  children,
  style,
  variant = "button",
  scale,
  haptic = "light",
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: PressableProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: Variant;
  scale?: number;
  haptic?: HapticKind;
}) {
  const motion = useMotionEnabled();
  const targetScale = scale ?? VARIANT_SCALE[variant];
  const pressed = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressed.value }],
    opacity: opacity.value,
  }));

  const fireHaptic = () => {
    if (disabled || haptic === false) return;
    switch (haptic) {
      case "medium":
        void hapticMedium();
        break;
      case "selection":
        void hapticSelection();
        break;
      case "success":
        void hapticSuccess();
        break;
      default:
        void hapticLight();
    }
  };

  const pressIn = (e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]) => {
    fireHaptic();
    if (motion) {
      pressed.value = withSpring(targetScale, Spring.press);
      if (variant === "card") {
        opacity.value = withTiming(MotionOpacity.pressed, timing(MotionDuration.tap));
      }
    } else {
      pressed.value = withTiming(targetScale, timing(MotionDuration.tap));
    }
    onPressIn?.(e);
  };

  const pressOut = (e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]) => {
    if (motion) {
      pressed.value = withSpring(1, Spring.press);
      opacity.value = withTiming(1, timing(MotionDuration.tap));
    } else {
      pressed.value = withTiming(1, timing(MotionDuration.tap));
      opacity.value = 1;
    }
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
