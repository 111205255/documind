import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../theme/ThemeContext";
import { PressableScale } from "../motion";

export function ChatHeader({
  title,
  showClose,
  onMenuPress,
}: {
  title: string;
  showClose?: boolean;
  onMenuPress?: () => void;
}) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <PressableScale
        onPress={() => router.back()}
        hitSlop={12}
        variant="button"
        haptic="light"
        accessibilityLabel={showClose ? "Close" : "Back"}
        style={styles.iconBtn}
      >
        <Ionicons
          name={showClose ? "close" : "chevron-back"}
          size={26}
          color={colors.brandPrimary}
        />
      </PressableScale>
      <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
        {title}
      </Text>
      <PressableScale
        onPress={onMenuPress}
        hitSlop={12}
        variant="button"
        haptic="selection"
        accessibilityLabel="More options"
        disabled={!onMenuPress}
        style={styles.iconBtn}
      >
        <Ionicons name="ellipsis-horizontal" size={24} color={colors.brandPrimary} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 8,
  },
  iconBtn: { width: 32, alignItems: "center" },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
});
