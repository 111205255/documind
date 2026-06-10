import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../../components/GradientBackground";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { ChatDocHero } from "../../components/chat/ChatDocHero";
import { ChatComposer } from "../../components/chat/ChatComposer";
import {
  ChatMessageBubble,
  type ChatMessage,
} from "../../components/chat/ChatMessageBubble";
import { ChatChip } from "../../components/chat/ChatChip";
import { CitationSheet } from "../../components/sheets/CitationSheet";
import { ShareSheet } from "../../components/sheets/ShareSheet";
import { FadeIn } from "../../components/motion";
import { askDocument } from "../../lib/api/chat";
import { createUuid } from "../../lib/uuid";
import { isApiConfigured } from "../../lib/env";
import { getOrCreateThread, loadThreadMessages, saveChatMessage } from "../../lib/supabase/chat";
import { getDocumentById } from "../../lib/supabase/documents-get";
import { useTheme } from "../../theme/ThemeContext";

const STARTERS = [
  "What is this document about?",
  "Summarize the key points.",
  "What are the main conclusions?",
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [title, setTitle] = useState("Document");
  const [pages, setPages] = useState(0);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [citationOpen, setCitationOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [activeCitation, setActiveCitation] = useState<{
    excerpt: string;
    page: number;
  } | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const doc = await getDocumentById(id);
      if (doc) {
        setTitle(doc.title);
        setPages(doc.page_count);
        const tid = await getOrCreateThread(id, doc.title);
        setThreadId(tid);
        const history = await loadThreadMessages(tid);
        setMessages(history);
      }
    })();
  }, [id]);

  const sendQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || thinking || !id || !threadId) return;

    setThinking(true);
    setInput("");

    const userMsg: ChatMessage = {
      id: createUuid(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    await saveChatMessage(threadId, "user", trimmed);

    if (!isApiConfigured()) {
      setMessages((prev) => [
        ...prev,
        {
          id: createUuid(),
          role: "assistant",
          content: "Set EXPO_PUBLIC_API_URL and run the FastAPI backend.",
        },
      ]);
      setThinking(false);
      return;
    }

    try {
      const { answer, citations, followUpQuestions } = await askDocument(id, trimmed);
      setFollowUps(followUpQuestions);
      const pageTag = citations[0] ? `p.${citations[0].page}` : undefined;
      const assistantMsg: ChatMessage = {
        id: createUuid(),
        role: "assistant",
        content: answer,
        pageTag,
        citations: citations.map((c, index) => ({
          excerpt: c.excerpt,
          page: c.page,
          index: c.index ?? index,
        })),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      await saveChatMessage(threadId, "assistant", answer, citations);
    } catch (e) {
      Alert.alert("Chat error", e instanceof Error ? e.message : "Failed");
    } finally {
      setThinking(false);
    }
  };

  const isEmpty = messages.length === 0 && !thinking;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.headerPad}>
          <ChatHeader title={title} onMenuPress={() => setShareOpen(true)} />
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={8}
        >
          {isEmpty ? (
            <ScrollView contentContainerStyle={styles.emptyScroll} showsVerticalScrollIndicator={false}>
              <ChatDocHero />
              <FadeIn delay={80}>
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  Ask anything about this doc
                </Text>
              </FadeIn>
              <FadeIn delay={140}>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  {pages > 0
                    ? `I've read all ${pages} pages. Tap a question to begin.`
                    : "Tap a question to begin — every answer cites its source."}
                </Text>
              </FadeIn>
              <View style={styles.chips}>
                {STARTERS.map((q, i) => (
                  <ChatChip key={q} label={q} index={i} onPress={() => void sendQuestion(q)} />
                ))}
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              ref={scrollRef}
              style={styles.flex}
              contentContainerStyle={styles.messages}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((m, i) => (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  index={i}
                  onCitationPress={() => {
                    const c = m.citations?.[0];
                    setActiveCitation({
                      excerpt: c?.excerpt ?? m.content.slice(0, 300),
                      page: c?.page ?? 1,
                    });
                    setCitationOpen(true);
                  }}
                />
              ))}
              {!thinking && followUps.length > 0 ? (
                <View style={styles.chips}>
                  {followUps.map((q, i) => (
                    <ChatChip key={q} label={q} index={i} onPress={() => void sendQuestion(q)} />
                  ))}
                </View>
              ) : null}
              {thinking ? (
                <ChatMessageBubble
                  message={{
                    id: "thinking",
                    role: "thinking",
                    content: "Thinking…",
                    thinkingVariant: "dots",
                  }}
                />
              ) : null}
            </ScrollView>
          )}

          <View style={styles.composerPad}>
            <ChatComposer
              value={input}
              onChangeText={setInput}
              onSend={() => void sendQuestion(input)}
              placeholder={isEmpty ? "Ask anything..." : "Ask a follow-up..."}
              thinking={thinking}
            />
          </View>
        </KeyboardAvoidingView>

        <CitationSheet
          visible={citationOpen}
          onClose={() => setCitationOpen(false)}
          documentTitle={title}
          pageLabel={
            activeCitation ? `Page ${activeCitation.page}` : "Source excerpt"
          }
          excerpt={activeCitation?.excerpt ?? ""}
        />
        <ShareSheet
          visible={shareOpen}
          onClose={() => setShareOpen(false)}
          title={title}
          shareText={[...messages].reverse().find((m) => m.role === "assistant")?.content}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  headerPad: { paddingHorizontal: 20 },
  composerPad: { paddingHorizontal: 16, paddingBottom: 8, paddingTop: 8 },
  emptyScroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 16,
  },
  emptyTitle: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  emptySub: { marginTop: 12, fontSize: 15, lineHeight: 22, textAlign: "center" },
  chips: { marginTop: 28, width: "100%", gap: 12 },
  messages: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
});
