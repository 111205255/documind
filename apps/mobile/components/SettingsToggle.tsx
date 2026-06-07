import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useTheme } from "../theme/ThemeContext";
import { PressableScale } from "./motion";
import { timing } from "../lib/motion";
import { hapticSelection } from "../lib/haptics";
import { MotionDuration } from "../theme/motion";

const THUMB_OFF = 2;
const THUMB_ON = 20;

export function SettingsToggle({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { colors } = useTheme();
  const thumbX = useSharedValue(value ? THUMB_ON : THUMB_OFF);
  const trackProgress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    thumbX.value = withTiming(value ? THUMB_ON : THUMB_OFF, timing(MotionDuration.fast));
    trackProgress.value = withTiming(value ? 1 : 0, timing(MotionDuration.fast));
  }, [value, thumbX, trackProgress]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  return (
    <PressableScale
      onPress={() => {
        void hapticSelection();
        onValueChange(!value);
      }}
      variant="chip"
      haptic={false}
      style={[
        styles.track,
        {
          backgroundColor: value ? colors.brandPrimary : colors.progressTrack,
        },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View style={[styles.thumb, thumbStyle]} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
