import { type ReactNode, useEffect } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { timing } from "../../lib/motion";
import { MotionDuration } from "../../theme/motion";

export function FadeIn({
  children,
  delay = 0,
  style,
  duration = MotionDuration.normal,
  offsetY = 6,
}: {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  offsetY?: number;
}) {
  const motion = useMotionEnabled();
  const opacity = useSharedValue(motion ? 0 : 1);
  const translateY = useSharedValue(motion ? offsetY : 0);

  useEffect(() => {
    if (!motion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    opacity.value = 0;
    translateY.value = offsetY;
    const config = timing(duration);
    opacity.value = withDelay(delay, withTiming(1, config));
    translateY.value = withDelay(delay, withTiming(0, config));
  }, [delay, duration, offsetY, motion, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!motion) {
    return <View style={style}>{children}</View>;
  }

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
