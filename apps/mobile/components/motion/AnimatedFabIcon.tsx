import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { Spring } from "../../theme/motion";

export function AnimatedFabIcon({
  open,
  size = 24,
  color = "#fff",
}: {
  open?: boolean;
  size?: number;
  color?: string;
}) {
  const motion = useMotionEnabled();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (!motion) {
      rotation.value = open ? 45 : 0;
      return;
    }
    rotation.value = withSpring(open ? 45 : 0, Spring.press);
  }, [open, motion, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!motion) {
    return <Ionicons name="add" size={size} color={color} />;
  }

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name="add" size={size} color={color} />
    </Animated.View>
  );
}
