import { Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { authButtonShadow } from "../theme/shadows";
import { PressableScale } from "./motion";
import { GoogleIcon } from "./GoogleIcon";

export function GoogleSignInButton({ onPress }: { onPress: () => void }) {
  const { colors, isDark } = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      variant="button"
      haptic="medium"
      style={[
        styles.button,
        authButtonShadow(isDark),
        {
          backgroundColor: colors.authButtonBg,
          borderColor: colors.authButtonBorder,
        },
      ]}
    >
      <GoogleIcon size={20} />
      <Text style={[styles.label, { color: colors.authButtonText }]}>
        Continue with Google
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  label: { fontSize: 16, fontWeight: "600" },
});
