import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { BottomSheet } from "../BottomSheet";
import { useTheme } from "../../theme/ThemeContext";
import { PressableScale } from "../motion";

export function UrlPasteSheet({
  visible,
  onClose,
  onSubmit,
  submitting,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  submitting?: boolean;
}) {
  const { colors } = useTheme();
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setUrl("");
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Paste a web link">
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Any public article or page. We&apos;ll read and index it for chat.
      </Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="https://example.com/article"
        placeholderTextColor={colors.textTertiary}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            borderColor: colors.borderDefault,
            backgroundColor: colors.surfaceRaised,
          },
        ]}
      />
      <PressableScale
        onPress={handleSubmit}
        variant="button"
        haptic="medium"
        disabled={submitting || !url.trim()}
        style={[styles.button, { backgroundColor: colors.brandPrimary, opacity: submitting ? 0.6 : 1 }]}
      >
        <Text style={styles.buttonText}>{submitting ? "Saving…" : "Index link"}</Text>
      </PressableScale>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 14,
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
