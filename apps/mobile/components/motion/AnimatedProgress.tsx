import { useEffect } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { timingDecelerate } from "../../lib/motion";
import { MotionDuration } from "../../theme/motion";

export function AnimatedProgress({
  progress,
  trackColor,
  fillColor,
  style,
  height = 6,
}: {
  progress: number;
  trackColor: string;
  fillColor: string;
  style?: StyleProp<ViewStyle>;
  height?: number;
}) {
  const motion = useMotionEnabled();
  const trackWidth = useSharedValue(0);
  const fillWidth = useSharedValue(0);

  useEffect(() => {
    const target = Math.min(1, Math.max(0, progress)) * trackWidth.value;
    fillWidth.value = motion
      ? withTiming(target, timingDecelerate(MotionDuration.normal))
      : target;
  }, [progress, motion, trackWidth.value, fillWidth, trackWidth]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    trackWidth.value = w;
    fillWidth.value = Math.min(1, Math.max(0, progress)) * w;
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: fillWidth.value,
  }));

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: trackColor },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { height, borderRadius: height / 2, backgroundColor: fillColor },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: "100%", overflow: "hidden" },
  fill: {},
});
