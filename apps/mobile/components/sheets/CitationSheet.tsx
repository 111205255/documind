import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BottomSheet } from "../BottomSheet";
import { useTheme } from "../../theme/ThemeContext";
import { FadeIn, PressableScale } from "../motion";

export function CitationSheet({
  visible,
  onClose,
  documentTitle = "HR Policy Handbook 2026",
  pageLabel = "Page 12 · Section 5: Leave",
  excerpt,
}: {
  visible: boolean;
  onClose: () => void;
  documentTitle?: string;
  pageLabel?: string;
  excerpt: string;
}) {
  const { colors } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <FadeIn>
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.brandGradientFrom, colors.brandGradientTo]}
            style={styles.docIcon}
          >
            <MaterialCommunityIcons name="file-document-outline" size={20} color="#fff" />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={[styles.docTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {documentTitle}
            </Text>
            <Text style={[styles.pageLabel, { color: colors.textSecondary }]}>{pageLabel}</Text>
          </View>
          <PressableScale
            onPress={onClose}
            variant="button"
            haptic="light"
            style={[styles.closeBtn, { backgroundColor: colors.sheetCardBg }]}
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </PressableScale>
        </View>
      </FadeIn>

      <FadeIn delay={40}>
        <View style={[styles.quoteCard, { backgroundColor: colors.sheetCardBg }]}>
          <Text style={[styles.quoteMark, { color: colors.brandPrimary }]}>"</Text>
          <Text style={[styles.quoteBody, { color: colors.textPrimary }]}>{excerpt}</Text>
        </View>
      </FadeIn>

      <FadeIn delay={80}>
        <PressableScale
          variant="button"
          haptic="medium"
          style={[styles.cta, { backgroundColor: colors.brandPrimary }]}
          onPress={onClose}
        >
          <Text style={styles.ctaText}>Open full document</Text>
        </PressableScale>
      </FadeIn>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  docTitle: { fontSize: 16, fontWeight: "700" },
  pageLabel: { marginTop: 2, fontSize: 13 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quoteCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  quoteMark: { fontSize: 28, fontWeight: "700", lineHeight: 28, marginBottom: 4 },
  quoteBody: { fontSize: 15, lineHeight: 22 },
  cta: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
