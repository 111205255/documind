import { useEffect } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { useTheme } from "../../theme/ThemeContext";
import { MotionDuration } from "../../theme/motion";

export function ShimmerBox({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const phase = useSharedValue(0);

  useEffect(() => {
    if (!motion) return;
    phase.value = withRepeat(
      withTiming(1, { duration: MotionDuration.slow, easing: Easing.linear }),
      -1,
      false,
    );
  }, [motion, phase]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: 0.12 + phase.value * 0.18,
  }));

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.progressTrack,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {motion ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.docSearchBg },
            overlayStyle,
          ]}
        />
      ) : null}
    </View>
  );
}

export function SkeletonLines({
  lines = 3,
  gap = 8,
}: {
  lines?: number;
  gap?: number;
}) {
  return (
    <View style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerBox
          key={i}
          width={i === lines - 1 ? "68%" : "100%"}
          height={12}
          borderRadius={6}
        />
      ))}
    </View>
  );
}
