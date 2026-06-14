import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { docCardShadow } from "../theme/shadows";
import { PressableScale, StaggerIn } from "./motion";
import { hapticMedium } from "../lib/haptics";

export function DocumentCard({
  title,
  subtitle,
  trailing,
  index = 0,
  onPress,
  onLongPress,
  onDelete,
  deleting = false,
  showChevron = true,
  alignTop = false,
}: {
  title: string;
  subtitle: string;
  trailing?: string;
  index?: number;
  onPress: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
  showChevron?: boolean;
  alignTop?: boolean;
}) {
  const { colors, isDark } = useTheme();

  return (
    <StaggerIn index={index}>
      <PressableScale
        onPress={onPress}
        onLongPress={onLongPress}
        variant="card"
        haptic="light"
        style={[
          styles.card,
          docCardShadow(isDark),
          alignTop && styles.cardAlignTop,
          { backgroundColor: colors.docCardBg },
        ]}
      >
        <LinearGradient
          colors={[colors.brandGradientFrom, colors.brandGradientTo]}
          style={styles.cardIcon}
        >
          <MaterialCommunityIcons name="file-document-outline" size={22} color="#fff" />
        </LinearGradient>
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
        {onDelete ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${title}`}
            disabled={deleting}
            onPress={() => {
              void hapticMedium();
              onDelete();
            }}
            hitSlop={10}
            style={[styles.deleteBtn, { opacity: deleting ? 0.4 : 1 }]}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color={colors.destructive}
            />
          </Pressable>
        ) : trailing ? (
          <Text style={[styles.time, { color: colors.textTertiary }]}>{trailing}</Text>
        ) : showChevron ? (
          <Ionicons name="chevron-forward" size={20} color={colors.docChevron} />
        ) : null}
      </PressableScale>
    </StaggerIn>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    gap: 14,
  },
  cardAlignTop: {
    alignItems: "flex-start",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardMeta: { marginTop: 4, fontSize: 14 },
  time: { fontSize: 12, paddingTop: 4 },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
