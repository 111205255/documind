import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMotionEnabled } from "../hooks/use-reduced-motion";
import { hapticLight } from "../lib/haptics";
import { timing } from "../lib/motion";
import { useTheme } from "../theme/ThemeContext";
import { MotionDuration, SheetGesture, Spring } from "../theme/motion";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  contentStyle,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  contentStyle?: ViewStyle;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const motion = useMotionEnabled();
  const [mounted, setMounted] = useState(visible);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const dragOffset = useSharedValue(0);
  const backdrop = useSharedValue(0);

  const sheetOpenY = 0;

  const finishUnmount = useCallback((notify: boolean) => {
    setMounted(false);
    if (notify) onClose();
  }, [onClose]);

  const animateClose = useCallback(
    (notify: boolean) => {
      const duration = motion ? MotionDuration.sheet : MotionDuration.fast;
      backdrop.value = withTiming(0, timing(duration));
      dragOffset.value = withTiming(0, timing(MotionDuration.tap));
      translateY.value = withTiming(
        SCREEN_HEIGHT,
        timing(duration),
        (done) => {
          if (done) runOnJS(finishUnmount)(notify);
        },
      );
    },
    [backdrop, dragOffset, finishUnmount, motion, translateY],
  );

  const animateOpen = useCallback(() => {
    void hapticLight();
    dragOffset.value = 0;
    translateY.value = SCREEN_HEIGHT;
    backdrop.value = withTiming(1, timing(MotionDuration.sheet));
    if (motion) {
      translateY.value = withSpring(sheetOpenY, Spring.sheet);
    } else {
      translateY.value = withTiming(sheetOpenY, timing(MotionDuration.sheet));
    }
  }, [backdrop, dragOffset, motion, translateY]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else if (mounted) {
      animateClose(false);
    }
  }, [visible, mounted, animateClose]);

  useEffect(() => {
    if (mounted && visible) {
      const id = requestAnimationFrame(() => animateOpen());
      return () => cancelAnimationFrame(id);
    }
  }, [mounted, visible, animateOpen]);

  const pan = Gesture.Pan()
    .activeOffsetY(8)
    .onUpdate((e) => {
      const dy = Math.max(0, e.translationY);
      const resisted =
        dy > SheetGesture.dismissDistance
          ? SheetGesture.dismissDistance +
            (dy - SheetGesture.dismissDistance) * SheetGesture.rubberBandFactor
          : dy;
      dragOffset.value = resisted;
    })
    .onEnd((e) => {
      const shouldDismiss =
        e.translationY > SheetGesture.dismissDistance ||
        e.velocityY > SheetGesture.dismissVelocity;
      if (shouldDismiss) {
        runOnJS(animateClose)(true);
      } else {
        dragOffset.value = withSpring(0, Spring.snap);
      }
    });

  const sheetAnim = useAnimatedStyle(() => {
    const y = translateY.value + dragOffset.value;
    const scale = interpolate(
      dragOffset.value,
      [0, SheetGesture.dismissDistance],
      [1, 0.97],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY: y }, { scale }] };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const y = translateY.value + dragOffset.value;
    const progress = interpolate(
      y,
      [SCREEN_HEIGHT, sheetOpenY],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const dragDim = interpolate(
      dragOffset.value,
      [0, SheetGesture.dismissDistance * 1.5],
      [1, 0.35],
      Extrapolation.CLAMP,
    );
    return { opacity: backdrop.value * progress * dragDim * 0.48 };
  });

  if (!mounted) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => animateClose(true)}
    >
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents="box-none"
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => animateClose(true)}
          accessibilityLabel="Close sheet"
        />
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.sheetBg,
              borderTopColor: colors.borderDefault,
              paddingBottom: Math.max(insets.bottom, 16),
            },
            contentStyle,
            sheetAnim,
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.sheetHandle }]} />
          {title ? (
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          ) : null}
          {children}
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: "88%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 24,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 5,
    borderRadius: 2.5,
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: -0.3,
  },
});
