import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { appleIdleCurve, appleIdlePhase, appleWave } from "../../lib/apple-motion";
import { timing } from "../../lib/motion";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { MotionDuration } from "../../theme/motion";

const ORBIT_R = 12;
const DOT = 3.5;

function OrbitDot({
  phase,
  offset,
  activeOpacity,
}: {
  phase: SharedValue<number>;
  offset: number;
  activeOpacity: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const angle = phase.value * Math.PI * 2 + offset;
    const highlight = (Math.sin(angle * 2) + 1) * 0.5;
    return {
      opacity: activeOpacity.value * (0.4 + highlight * 0.55),
      transform: [
        { translateX: Math.cos(angle) * ORBIT_R },
        { translateY: Math.sin(angle) * ORBIT_R },
        { scale: 0.8 + highlight * 0.35 },
      ],
    };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

/**
 * Send-button sparkle while AI thinks — Apple-caliber:
 * soft breathe + gentle rock, orbiting highlights, periodic ripple (no full spin).
 */
export function ThinkingSparkle({ active }: { active: boolean }) {
  const motion = useMotionEnabled();
  const idle = useSharedValue(0);
  const orbit = useSharedValue(0);
  const activeOpacity = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    activeOpacity.value = withTiming(active ? 1 : 0, timing(MotionDuration.fast));
    if (!active || !motion) {
      idle.value = 0;
      orbit.value = 0;
      return;
    }
    idle.value = appleIdlePhase();
    orbit.value = appleIdlePhase();
  }, [active, motion, idle, orbit, activeOpacity]);

  const centerStyle = useAnimatedStyle(() => {
    const p = idle.value;
    const lift = appleIdleCurve(p);
    return {
      opacity: activeOpacity.value,
      transform: [
        { rotate: `${appleWave(p, 14)}deg` },
        { scale: 0.94 + lift * 0.14 },
      ],
    };
  });

  const rippleStyle = useAnimatedStyle(() => {
    const p = idle.value;
    const t = appleIdleCurve(p);
    return {
      opacity: activeOpacity.value * t * 0.45,
      transform: [{ scale: 0.65 + t * 0.95 }],
    };
  });

  const ripple2Style = useAnimatedStyle(() => {
    const p = idle.value;
    const t = appleIdleCurve((p + 0.35) % 1);
    return {
      opacity: activeOpacity.value * t * 0.25,
      transform: [{ scale: 0.5 + t * 0.75 }],
    };
  });

  if (!active) {
    return <MaterialCommunityIcons name="star-four-points" size={20} color="#fff" />;
  }

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.ripple, ripple2Style]} />
      <Animated.View style={[styles.ripple, rippleStyle]} />
      <OrbitDot phase={orbit} offset={0} activeOpacity={activeOpacity} />
      <OrbitDot phase={orbit} offset={(2 * Math.PI) / 3} activeOpacity={activeOpacity} />
      <OrbitDot phase={orbit} offset={(4 * Math.PI) / 3} activeOpacity={activeOpacity} />
      <Animated.View style={centerStyle}>
        <MaterialCommunityIcons name="star-four-points" size={20} color="#fff" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  dot: {
    position: "absolute",
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
});
