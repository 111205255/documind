import { type ReactNode, useEffect } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { MotionDuration } from "../../theme/motion";

/** Very subtle idle float — Apple empty-state caliber */
export function FloatingIcon({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const motion = useMotionEnabled();
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!motion) return;
    const ease = Easing.inOut(Easing.sin);
    const half = MotionDuration.slow;
    translateY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: half, easing: ease }),
        withTiming(0, { duration: half, easing: ease }),
      ),
      -1,
      true,
    );
  }, [motion, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!motion) {
    return <Animated.View style={style}>{children}</Animated.View>;
  }

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
