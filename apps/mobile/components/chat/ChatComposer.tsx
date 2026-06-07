import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext";
import { PressableScale } from "../motion";
import { ThinkingSparkle } from "./ThinkingSparkle";

export function ChatComposer({
  value,
  onChangeText,
  onSend,
  placeholder = "Ask anything...",
  thinking,
}: {
  value: string;
  onChangeText: (t: string) => void;
  onSend?: () => void;
  placeholder?: string;
  thinking?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.chatInputBg,
          borderColor: colors.borderDefault,
        },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { color: colors.textPrimary }]}
        multiline
      />
      <PressableScale
        onPress={onSend}
        variant="button"
        haptic="medium"
        style={[
          styles.send,
          { backgroundColor: colors.brandPrimary },
          thinking && styles.sendThinking,
        ]}
        accessibilityLabel="Send"
      >
        {thinking ? (
          <ThinkingSparkle active />
        ) : (
          <Ionicons name="arrow-up" size={22} color="#fff" />
        )}
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 28,
    borderWidth: 1,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 10,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendThinking: {
    overflow: "visible",
  },
});
