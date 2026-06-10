import { type ComponentProps, useEffect } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { Spring } from "../../theme/motion";

type IoniconName = ComponentProps<typeof Ionicons>["name"];
type MaterialName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type AnimatedIconProps = {
  active?: boolean;
  size?: number;
  color: string;
  activeColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function AnimatedIonIcon({
  name,
  activeName,
  active = false,
  size = 24,
  color,
  activeColor,
  style,
}: AnimatedIconProps & {
  name: IoniconName;
  activeName?: IoniconName;
}) {
  const motion = useMotionEnabled();
  const scale = useSharedValue(active ? 1.08 : 1);

  useEffect(() => {
    if (!motion) {
      scale.value = active ? 1.08 : 1;
      return;
    }
    scale.value = withSpring(active ? 1.08 : 1, Spring.press);
  }, [active, motion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resolvedColor = active && activeColor ? activeColor : color;
  const resolvedName = active && activeName ? activeName : name;

  return (
    <Animated.View style={[style, motion ? animatedStyle : undefined]}>
      <Ionicons name={resolvedName} size={size} color={resolvedColor} />
    </Animated.View>
  );
}

export function AnimatedMaterialIcon({
  name,
  activeName,
  active = false,
  size = 24,
  color,
  activeColor,
  style,
}: AnimatedIconProps & {
  name: MaterialName;
  activeName?: MaterialName;
}) {
  const motion = useMotionEnabled();
  const scale = useSharedValue(active ? 1.08 : 1);

  useEffect(() => {
    if (!motion) {
      scale.value = active ? 1.08 : 1;
      return;
    }
    scale.value = withSpring(active ? 1.08 : 1, Spring.press);
  }, [active, motion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resolvedColor = active && activeColor ? activeColor : color;
  const resolvedName = active && activeName ? activeName : name;

  return (
    <Animated.View style={[style, motion ? animatedStyle : undefined]}>
      <MaterialCommunityIcons name={resolvedName} size={size} color={resolvedColor} />
    </Animated.View>
  );
}
