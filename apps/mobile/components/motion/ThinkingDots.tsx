import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { useTheme } from "../../theme/ThemeContext";
import { MotionDuration } from "../../theme/motion";

const DOT = 5;
const GAP = 5;
const CYCLE = MotionDuration.thinking / 3;

export function ThinkingDots() {
  const { colors } = useTheme();
  const motion = useMotionEnabled();

  if (!motion) {
    return (
      <View style={styles.row} accessibilityLabel="AI is thinking">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: colors.textTertiary, opacity: 0.5 }]}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.row} accessibilityLabel="AI is thinking">
      {[0, 1, 2].map((i) => (
        <Dot key={i} index={i} color={colors.brandPrimary} idle={colors.textTertiary} />
      ))}
    </View>
  );
}

function Dot({ index, color, idle }: { index: number; color: string; idle: string }) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    const ease = Easing.inOut(Easing.ease);
    opacity.value = withDelay(
      index * (CYCLE * 0.28),
      withRepeat(
        withSequence(
          withTiming(1, { duration: CYCLE * 0.35, easing: ease }),
          withTiming(0.35, { duration: CYCLE * 0.65, easing: ease }),
        ),
        -1,
        false,
      ),
    );
  }, [index, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: opacity.value > 0.65 ? color : idle,
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: GAP, alignItems: "center" },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
});
