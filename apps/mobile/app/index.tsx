import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../components/GradientBackground";
import { AppLogo } from "../components/AppLogo";
import { OnboardingDots } from "../components/OnboardingDots";
import { APP_NAME, APP_TAGLINE } from "../lib/constants";
import { useTheme } from "../theme/ThemeContext";
import { FloatingIcon } from "../components/motion";

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/login"), 2400);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <FloatingIcon>
            <AppLogo size="lg" />
          </FloatingIcon>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{APP_NAME}</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>{APP_TAGLINE}</Text>
        </View>
        <OnboardingDots active={0} />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 24, paddingBottom: 48 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { marginTop: 24, fontSize: 32, fontWeight: "700" },
  tagline: { marginTop: 8, fontSize: 16 },
});
