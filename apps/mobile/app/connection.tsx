import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GradientBackground } from "../components/GradientBackground";
import { ScreenHeader } from "../components/ScreenHeader";
import { useTheme } from "../theme/ThemeContext";
import { docEmptyIconShadow, docFabShadow } from "../theme/shadows";
import { FadeIn, FloatingIcon, PressableScale } from "../components/motion";

export default function ConnectionScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.headerPad}>
          <ScreenHeader title="Connection" />
        </View>

        <View style={styles.center}>
          <FadeIn>
            <FloatingIcon>
              <View
                style={[
                  styles.iconBox,
                  docEmptyIconShadow(isDark),
                  { backgroundColor: colors.docEmptyIconBg },
                ]}
              >
                <MaterialCommunityIcons
                  name="cloud-off-outline"
                  size={48}
                  color={colors.brandPrimary}
                />
              </View>
            </FloatingIcon>
          </FadeIn>

          <FadeIn delay={100}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>You're offline</Text>
          </FadeIn>
          <FadeIn delay={160}>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              DocuMind needs a connection to reach your documents. Check your network and try
              again.
            </Text>
          </FadeIn>

          <FadeIn delay={240}>
            <PressableScale
              onPress={() => router.back()}
              haptic="medium"
              variant="button"
              style={[styles.cta, docFabShadow(), { backgroundColor: colors.brandPrimary }]}
            >
              <Text style={styles.ctaText}>Try again</Text>
            </PressableScale>
          </FadeIn>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerPad: { paddingHorizontal: 20 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  desc: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 300,
  },
  cta: {
    marginTop: 36,
    height: 52,
    width: "100%",
    maxWidth: 320,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
