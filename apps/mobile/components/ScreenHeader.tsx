import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import { PressableScale } from "./motion";

export function ScreenHeader({
  title,
  onBack,
  showBack = true,
}: {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {showBack ? (
        <PressableScale
          onPress={onBack ?? (() => router.back())}
          hitSlop={12}
          variant="button"
          haptic="light"
          accessibilityLabel="Back"
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={26} color={colors.brandPrimary} />
        </PressableScale>
      ) : (
        <View style={styles.backBtn} />
      )}
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  backBtn: { width: 26 },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  spacer: { width: 26 },
});
