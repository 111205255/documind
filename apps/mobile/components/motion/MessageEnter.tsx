import { type ReactNode, useEffect } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { staggerDelay, timing } from "../../lib/motion";
import { MotionDuration, Stagger } from "../../theme/motion";

/** Single entrance for chat bubbles — Apple Messages–style subtle slide + fade */
export function MessageEnter({
  children,
  index = 0,
  role = "assistant",
  style,
}: {
  children: ReactNode;
  index?: number;
  role?: "user" | "assistant" | "thinking";
  style?: StyleProp<ViewStyle>;
}) {
  const motion = useMotionEnabled();
  const offsetX = role === "user" ? 10 : -10;
  const opacity = useSharedValue(motion ? 0 : 1);
  const translateX = useSharedValue(motion ? offsetX : 0);
  const translateY = useSharedValue(motion ? 4 : 0);

  useEffect(() => {
    if (!motion) {
      opacity.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      return;
    }
    const delay = staggerDelay(index, Stagger.message);
    const config = timing(MotionDuration.fast);
    opacity.value = withDelay(delay, withTiming(1, config));
    translateX.value = withDelay(delay, withTiming(0, config));
    translateY.value = withDelay(delay, withTiming(0, config));
  }, [index, motion, offsetX, opacity, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
