import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ListRenderItem,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { GradientBackground } from "../components/GradientBackground";
import { AddDocumentSheet } from "../components/sheets/AddDocumentSheet";
import { DocumentCard } from "../components/DocumentCard";
import type { DocumentListItem } from "../data/demo-documents";
import { navigate } from "../lib/nav";
import { isSupabaseConfigured } from "../lib/env";
import {
  deleteDocument,
  pickAndUploadPdf,
  pickAndUploadWord,
  uploadUrlDocument,
} from "../lib/supabase/documents";
import { UrlPasteSheet } from "../components/sheets/UrlPasteSheet";
import { useDocuments } from "../hooks/useDocuments";
import { useTheme } from "../theme/ThemeContext";
import { docEmptyIconShadow, docFabShadow } from "../theme/shadows";
import { AnimatedFabIcon, FadeIn, FloatingIcon, PressableScale } from "../components/motion";
import { BottomTabBar } from "../components/navigation/BottomTabBar";

export default function HomeScreen() {
  const { empty } = useLocalSearchParams<{ empty?: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [urlSheetOpen, setUrlSheetOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { documents, loading, refresh } = useDocuments(empty !== undefined);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((d) => d.title.toLowerCase().includes(q));
  }, [documents, search]);

  const isEmpty = documents.length === 0;

  const openUploadSheet = () => setSheetOpen(true);

  const afterUpload = async (doc: { id: string; title: string }) => {
    await refresh();
    router.push({
      pathname: "/document/[id]/processing",
      params: { id: doc.id, title: doc.title },
    });
  };

  const uploadPdf = async () => {
    if (!isSupabaseConfigured()) {
      Alert.alert("Supabase not configured", "Add EXPO_PUBLIC_SUPABASE_* to apps/mobile/.env");
      return;
    }
    setUploading(true);
    try {
      const doc = await pickAndUploadPdf();
      await afterUpload(doc);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Upload failed.";
      if (message !== "Upload cancelled.") {
        Alert.alert("Upload failed", message);
      }
    } finally {
      setUploading(false);
    }
  };

  const uploadWord = async () => {
    if (!isSupabaseConfigured()) {
      Alert.alert("Supabase not configured", "Add EXPO_PUBLIC_SUPABASE_* to apps/mobile/.env");
      return;
    }
    setUploading(true);
    try {
      const doc = await pickAndUploadWord();
      await afterUpload(doc);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Upload failed.";
      if (message !== "Upload cancelled.") {
        Alert.alert("Upload failed", message);
      }
    } finally {
      setUploading(false);
    }
  };

  const uploadUrl = async (url: string) => {
    if (!isSupabaseConfigured()) {
      Alert.alert("Supabase not configured", "Add EXPO_PUBLIC_SUPABASE_* to apps/mobile/.env");
      return;
    }
    setUploading(true);
    try {
      const doc = await uploadUrlDocument(url);
      setUrlSheetOpen(false);
      await afterUpload(doc);
    } catch (e) {
      Alert.alert("Link failed", e instanceof Error ? e.message : "Could not save link.");
    } finally {
      setUploading(false);
    }
  };

  const openDocument = (item: DocumentListItem) => {
    if (item.status && item.status !== "ready") {
      router.push({
        pathname: "/document/[id]/processing",
        params: { id: item.id, title: item.title },
      });
      return;
    }
    router.push({
      pathname: "/chat/[id]",
      params: { id: item.id, mode: "empty" },
    });
  };

  const openDocumentDetails = (item: DocumentListItem) => {
    navigate({
      pathname: "/document/[id]/details",
      params: { id: item.id },
    } as never);
  };

  const confirmDelete = (item: DocumentListItem) => {
    if (deletingId) return;
    Alert.alert("Delete document", `Delete "${item.title}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setDeletingId(item.id);
          void deleteDocument(item.id)
            .then(refresh)
            .catch((e) =>
              Alert.alert("Delete failed", e instanceof Error ? e.message : "Could not delete."),
            )
            .finally(() => setDeletingId(null));
        },
      },
    ]);
  };

  const renderItem: ListRenderItem<DocumentListItem> = ({ item, index }) => (
    <DocumentCard
      title={item.title}
      subtitle={`${item.pageCount} pages · ${item.relativeTime}`}
      index={index}
      onPress={() => openDocument(item)}
      onLongPress={() => openDocumentDetails(item)}
      onDelete={() => confirmDelete(item)}
      deleting={deletingId === item.id}
    />
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <FadeIn>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Documents</Text>
              <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
                Ask any of your documents anything
              </Text>
            </View>
          </View>
        </FadeIn>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.brandPrimary} />
          </View>
        ) : isEmpty ? (
          <View style={styles.emptyWrap}>
            <FloatingIcon>
              <View
                style={[
                  styles.emptyIconBox,
                  docEmptyIconShadow(isDark),
                  { backgroundColor: colors.docEmptyIconBg },
                ]}
              >
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={48}
                  color={colors.brandPrimary}
                />
              </View>
            </FloatingIcon>
            <FadeIn delay={100}>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No documents yet
              </Text>
            </FadeIn>
            <FadeIn delay={160}>
              <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                Upload a PDF, Word file or paste a link to start chatting with it.
              </Text>
            </FadeIn>
            <FadeIn delay={220}>
              <PressableScale
                onPress={openUploadSheet}
                variant="button"
                haptic="medium"
                style={[
                  styles.emptyCta,
                  docFabShadow(),
                  { backgroundColor: colors.brandPrimary },
                ]}
              >
                <AnimatedFabIcon open={sheetOpen} size={22} />
                <Text style={styles.emptyCtaText}>Upload your first document</Text>
              </PressableScale>
            </FadeIn>
          </View>
        ) : (
          <>
            <FadeIn delay={60}>
              <View
                style={[
                  styles.searchWrap,
                  {
                    backgroundColor: colors.docSearchBg,
                    borderColor: colors.docSearchBorder,
                  },
                ]}
              >
                <Ionicons name="search" size={20} color={colors.textTertiary} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search documents"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.searchInput, { color: colors.textPrimary }]}
                />
              </View>
            </FadeIn>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                search.trim() ? (
                  <Text style={[styles.noResults, { color: colors.textSecondary }]}>
                    {`No documents match "${search.trim()}"`}
                  </Text>
                ) : null
              }
            />

            <PressableScale
              onPress={openUploadSheet}
              variant="button"
              haptic="medium"
              style={[styles.fab, docFabShadow(), { backgroundColor: colors.brandPrimary }]}
            >
              <AnimatedFabIcon open={sheetOpen} size={24} />
              <Text style={styles.fabText}>Upload</Text>
            </PressableScale>
          </>
        )}

        <BottomTabBar />
      </SafeAreaView>

      <AddDocumentSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelectPdf={() => void uploadPdf()}
        onSelectWord={() => void uploadWord()}
        onSelectLink={() => setUrlSheetOpen(true)}
      />

      <UrlPasteSheet
        visible={urlSheetOpen}
        onClose={() => setUrlSheetOpen(false)}
        onSubmit={(url) => void uploadUrl(url)}
        submitting={uploading}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 24 },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { flexDirection: "row", alignItems: "flex-start", marginBottom: 24, marginTop: 8 },
  headerText: { flex: 1, paddingRight: 12 },
  pageTitle: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  pageSubtitle: { marginTop: 8, fontSize: 16 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 0 },
  list: { paddingBottom: 120 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 88,
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 28,
    gap: 6,
  },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 80 },
  emptyIconBox: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  noResults: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  emptyTitle: { marginTop: 32, fontSize: 20, fontWeight: "700" },
  emptyDesc: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 280,
  },
  emptyCta: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 6,
  },
  emptyCtaText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
