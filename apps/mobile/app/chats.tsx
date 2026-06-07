import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ListRenderItem,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { GradientBackground } from "../components/GradientBackground";
import { DocumentCard } from "../components/DocumentCard";
import { listChatThreads } from "../lib/supabase/chat";
import { useTheme } from "../theme/ThemeContext";
import { FadeIn } from "../components/motion";

type ThreadItem = {
  id: string;
  documentId: string;
  title: string;
  preview: string;
};

export default function ChatsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listChatThreads()
      .then(setThreads)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (t) =>
        t.title.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q),
    );
  }, [search, threads]);

  const renderItem: ListRenderItem<ThreadItem> = ({ item, index }) => (
    <DocumentCard
      title={item.title}
      subtitle={item.preview}
      index={index}
      showChevron={false}
      alignTop
      onPress={() =>
        router.push({
          pathname: "/chat/[id]",
          params: { id: item.documentId },
        })
      }
    />
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <FadeIn>
          <View style={styles.header}>
            <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Chats</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Your recent conversations
            </Text>
          </View>
        </FadeIn>

        <FadeIn delay={50}>
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
              placeholder="Search chats"
              placeholderTextColor={colors.textTertiary}
              style={[styles.searchInput, { color: colors.textPrimary }]}
            />
          </View>
        </FadeIn>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.brandPrimary} />
        ) : filtered.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            No conversations yet. Upload a document and start chatting.
          </Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 24 },
  header: { marginTop: 8, marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 16 },
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
  list: { paddingBottom: 32 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 15, paddingHorizontal: 16 },
});
