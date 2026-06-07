import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { GradientBackground } from "../../../components/GradientBackground";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { ShareSheet } from "../../../components/sheets/ShareSheet";
import { getDocumentById } from "../../../lib/supabase/documents-get";
import { deleteDocument } from "../../../lib/supabase/documents";
import { formatRelativeTime } from "../../../lib/format-relative-time";
import type { DocumentRow } from "../../../lib/supabase/types";
import { useTheme } from "../../../theme/ThemeContext";
import { docCardShadow } from "../../../theme/shadows";
import { FadeIn, PressableScale, StaggerIn } from "../../../components/motion";

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeLabel(mime: string): string {
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("word")) return "Word";
  return "Document";
}

export default function DocumentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [shareOpen, setShareOpen] = useState(false);
  const [doc, setDoc] = useState<DocumentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    void getDocumentById(id)
      .then(setDoc)
      .finally(() => setLoading(false));
  }, [id]);

  const stats = useMemo(() => {
    if (!doc) return [];
    return [
      { value: String(doc.page_count || "—"), label: "Pages" },
      { value: formatFileSize(doc.file_size_bytes), label: "File size" },
      { value: formatRelativeTime(doc.created_at), label: "Uploaded" },
    ];
  }, [doc]);

  const handleDelete = () => {
    if (!id || deleting) return;
    Alert.alert("Delete document", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setDeleting(true);
          void deleteDocument(id)
            .then(() => router.replace("/home"))
            .catch((e) =>
              Alert.alert("Delete failed", e instanceof Error ? e.message : "Could not delete."),
            )
            .finally(() => setDeleting(false));
        },
      },
    ]);
  };

  const actions = [
    {
      icon: "magnify" as const,
      label: "View document",
      destructive: false,
      onPress: () => id && router.push({ pathname: "/chat/[id]", params: { id } }),
    },
    {
      icon: "share-variant" as const,
      label: "Share document",
      destructive: false,
      onPress: () => setShareOpen(true),
    },
    {
      icon: "trash-can-outline" as const,
      label: deleting ? "Deleting…" : "Delete document",
      destructive: true,
      onPress: handleDelete,
    },
  ];

  if (loading) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <ActivityIndicator style={{ marginTop: 80 }} color={colors.brandPrimary} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (!doc) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <View style={styles.headerPad}>
            <ScreenHeader title="Details" />
          </View>
          <Text style={[styles.missing, { color: colors.textSecondary }]}>Document not found.</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.headerPad}>
          <ScreenHeader title="Details" />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <FadeIn>
          <View
            style={[
              styles.heroCard,
              docCardShadow(isDark),
              { backgroundColor: colors.docCardBg },
            ]}
          >
            <LinearGradient
              colors={[colors.brandGradientFrom, colors.brandGradientTo]}
              style={styles.heroIcon}
            >
              <MaterialCommunityIcons name="file-document-outline" size={32} color="#fff" />
            </LinearGradient>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
              {doc.title}
            </Text>
            <Text style={[styles.heroMeta, { color: colors.textSecondary }]}>
              {mimeLabel(doc.mime_type)} · {doc.page_count || "?"} pages · {formatFileSize(doc.file_size_bytes)}
            </Text>
          </View>
          </FadeIn>

          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <StaggerIn key={s.label} index={i} step={50}>
              <View
                style={[
                  styles.statCard,
                  docCardShadow(isDark),
                  { backgroundColor: colors.docCardBg },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {s.value}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {s.label}
                </Text>
              </View>
              </StaggerIn>
            ))}
          </View>

          <FadeIn delay={120}>
          <View
            style={[
              styles.actionsCard,
              docCardShadow(isDark),
              { backgroundColor: colors.docCardBg },
            ]}
          >
            {actions.map((action, i) => (
              <View key={action.label}>
                <PressableScale
                  onPress={action.onPress}
                  variant="card"
                  haptic={action.destructive ? "medium" : "light"}
                  style={styles.actionRow}
                  disabled={deleting && action.destructive}
                >
                  <View
                    style={[
                      styles.actionIconWrap,
                      {
                        backgroundColor: action.destructive
                          ? colors.destructiveIconBg
                          : colors.settingsIconBg,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={action.icon}
                      size={20}
                      color={action.destructive ? colors.destructive : colors.textSecondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.actionLabel,
                      {
                        color: action.destructive
                          ? colors.destructive
                          : colors.textPrimary,
                      },
                    ]}
                  >
                    {action.label}
                  </Text>
                  {!action.destructive ? (
                    <Ionicons name="chevron-forward" size={20} color={colors.docChevron} />
                  ) : null}
                </PressableScale>
                {i < actions.length - 1 ? (
                  <View
                    style={[styles.divider, { backgroundColor: colors.settingsDivider }]}
                  />
                ) : null}
              </View>
            ))}
          </View>
          </FadeIn>
        </ScrollView>

        <ShareSheet visible={shareOpen} onClose={() => setShareOpen(false)} title={doc.title} />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerPad: { paddingHorizontal: 20 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  missing: { textAlign: "center", marginTop: 40, fontSize: 15 },
  heroCard: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  heroMeta: { marginTop: 6, fontSize: 14 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  statValue: { fontSize: 22, fontWeight: "700" },
  statLabel: { marginTop: 4, fontSize: 12, textAlign: "center" },
  actionsCard: { borderRadius: 20, overflow: "hidden" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { flex: 1, fontSize: 16, fontWeight: "500" },
  divider: { height: 1, marginLeft: 70 },
});
