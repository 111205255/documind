import { View, Text, StyleSheet, Platform, Alert, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheet } from "../BottomSheet";
import { useTheme } from "../../theme/ThemeContext";
import { sheetRowShadow } from "../../theme/shadows";
import { PressableScale, StaggerIn } from "../motion";
import { hapticSuccess } from "../../lib/haptics";

const SHARE_ACTIONS = [
  { id: "whatsapp", label: "WhatsApp", icon: "whatsapp" as const, color: "#25D366" },
  { id: "copy", label: "Copy answer", icon: "content-copy" as const },
] as const;

async function copyText(text: string): Promise<void> {
  if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  throw new Error("Copy is available on web. Use WhatsApp on mobile.");
}

export function ShareSheet({
  visible,
  onClose,
  title = "DocuMind",
  shareText,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  shareText?: string;
}) {
  const { colors, isDark } = useTheme();

  const handleAction = async (id: string) => {
    void hapticSuccess();
    const text = shareText?.trim();
    if (!text) {
      Alert.alert("Nothing to share", "Ask a question first to get an answer.");
      onClose();
      return;
    }

    try {
      if (id === "whatsapp") {
        await Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`);
      } else if (id === "copy") {
        await copyText(text);
        Alert.alert("Copied", "Answer copied to clipboard.");
      }
    } catch (e) {
      Alert.alert("Share failed", e instanceof Error ? e.message : "Could not share.");
    }
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <StaggerIn index={0}>
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.brandGradientFrom, colors.brandGradientTo]}
            style={styles.docIcon}
          >
            <MaterialCommunityIcons name="file-document-outline" size={20} color="#fff" />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              Share this conversation
            </Text>
          </View>
        </View>
      </StaggerIn>

      <View style={styles.actions}>
        {SHARE_ACTIONS.map((action, i) => (
          <StaggerIn key={action.id} index={i + 1}>
            <PressableScale
              onPress={() => void handleAction(action.id)}
              variant="button"
              haptic="selection"
              style={styles.actionItem}
            >
              <View
                style={[
                  styles.actionIcon,
                  sheetRowShadow(isDark),
                  { backgroundColor: colors.sheetCardBg },
                ]}
              >
                <MaterialCommunityIcons
                  name={action.icon}
                  size={24}
                  color={action.color ?? colors.brandPrimary}
                />
              </View>
              <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
                {action.label}
              </Text>
            </PressableScale>
          </StaggerIn>
        ))}
      </View>

      {shareText ? (
        <Text style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={3}>
          {shareText}
        </Text>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700" },
  sub: { marginTop: 2, fontSize: 13 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  actionItem: { alignItems: "center", width: 72 },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionLabel: { fontSize: 12 },
  preview: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
});
