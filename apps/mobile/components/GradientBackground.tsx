import { View, StyleSheet, type ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export function GradientBackground({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.pageBg }, style]}>
      <View
        style={[styles.glowTopRight, { backgroundColor: colors.glowA }]}
        pointerEvents="none"
      />
      <View
        style={[styles.glowBottomLeft, { backgroundColor: colors.glowB }]}
        pointerEvents="none"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, zIndex: 1 },
  glowTopRight: {
    position: "absolute",
    top: -120,
    right: -100,
    width: 340,
    height: 340,
    borderRadius: 170,
    opacity: 0.55,
  },
  glowBottomLeft: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
});
