import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { useTheme } from "../../theme/ThemeContext";
import { timing } from "../../lib/motion";
import { MotionDuration, Spring } from "../../theme/motion";

export function SuccessPulse({ visible }: { visible: boolean }) {
  const { colors } = useTheme();
  const motion = useMotionEnabled();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      scale.value = 0.6;
      opacity.value = 0;
      return;
    }
    if (!motion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }
    opacity.value = withTiming(1, timing(MotionDuration.fast));
    scale.value = withSpring(1, Spring.reveal);
  }, [visible, motion, opacity, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Animated.View style={iconStyle}>
        <View style={[styles.icon, { backgroundColor: colors.brandPrimary }]}>
          <MaterialCommunityIcons name="check" size={28} color="#fff" />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", height: 72 },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
