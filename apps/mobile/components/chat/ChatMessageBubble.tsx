import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext";
import {
  MessageEnter,
  PressableScale,
  ThinkingDots,
  SkeletonLines,
} from "../motion";

export type ChatCitation = {
  excerpt: string;
  page: number;
  index: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "thinking";
  content: string;
  pageTag?: string;
  citations?: ChatCitation[];
  thinkingVariant?: "dots" | "scanning";
  scanRange?: string;
};

export function ChatMessageBubble({
  message,
  index = 0,
  onCitationPress,
}: {
  message: ChatMessage;
  index?: number;
  onCitationPress?: (page: string) => void;
}) {
  const { colors } = useTheme();

  if (message.role === "user") {
    return (
      <MessageEnter index={index} role="user">
        <View style={styles.userWrap}>
          <View style={[styles.userBubble, { backgroundColor: colors.chatUserBubble }]}>
            <Text style={styles.userText}>{message.content}</Text>
          </View>
        </View>
      </MessageEnter>
    );
  }

  if (message.role === "thinking") {
    return (
      <MessageEnter index={index} role="thinking">
        <View style={styles.assistantWrap}>
          <View style={[styles.assistantBubble, { backgroundColor: colors.chatAssistantBubble }]}>
            <View style={styles.thinkingRow}>
              {message.thinkingVariant === "scanning" ? (
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={16}
                  color={colors.brandPrimary}
                />
              ) : (
                <ThinkingDots />
              )}
              <Text style={[styles.thinkingText, { color: colors.textSecondary }]}>
                {message.content}
              </Text>
            </View>
            {message.thinkingVariant !== "scanning" ? (
              <View style={styles.skeletonPad}>
                <SkeletonLines lines={2} gap={6} />
              </View>
            ) : null}
          </View>
        </View>
      </MessageEnter>
    );
  }

  return (
    <MessageEnter index={index} role="assistant">
      <View style={styles.assistantWrap}>
        <View style={[styles.assistantBubble, { backgroundColor: colors.chatAssistantBubble }]}>
          <Text style={[styles.assistantText, { color: colors.textPrimary }]}>
            {message.content}
          </Text>
          {message.pageTag ? (
            <CitationPill
              label={message.pageTag}
              onPress={() => onCitationPress?.(message.pageTag!)}
            />
          ) : null}
        </View>
      </View>
    </MessageEnter>
  );
}

function CitationPill({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      variant="chip"
      haptic="selection"
      style={[
        styles.citation,
        {
          backgroundColor: colors.citationTagBg,
          borderColor: colors.citationBorder,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="file-document-outline"
        size={14}
        color={colors.citationText}
      />
      <Text style={[styles.citationText, { color: colors.citationText }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  userWrap: { alignItems: "flex-end", marginBottom: 10 },
  userBubble: {
    maxWidth: "85%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  userText: { color: "#fff", fontSize: 15, lineHeight: 22 },
  assistantWrap: { alignItems: "flex-start", marginBottom: 10 },
  assistantBubble: {
    maxWidth: "88%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  assistantText: { fontSize: 15, lineHeight: 22 },
  citation: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  citationText: { fontSize: 13, fontWeight: "600" },
  thinkingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  thinkingText: { fontSize: 14, flexShrink: 1 },
  skeletonPad: { marginTop: 10 },
});
