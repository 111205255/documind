import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GradientBackground } from "../components/GradientBackground";
import { AppLogo } from "../components/AppLogo";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { APP_NAME } from "../lib/constants";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "../lib/supabase/auth";
import { isSupabaseConfigured } from "../lib/env";
import { useTheme } from "../theme/ThemeContext";
import { FadeIn, StaggerIn } from "../components/motion";

const FEATURES = [
  {
    icon: "star-four-points-outline" as const,
    title: "Answers with citations",
    description: "Every reply links to the exact page",
  },
  {
    icon: "magnify" as const,
    title: "Search across documents",
    description: "Find anything in seconds",
  },
  {
    icon: "file-document-outline" as const,
    title: "PDF, Word & web links",
    description: "Upload almost any source",
  },
];

type AuthMode = "sign-in" | "sign-up";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const goHome = () => router.replace("/home");

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured()) {
      Alert.alert("Not configured", "Add EXPO_PUBLIC_SUPABASE_* to apps/mobile/.env");
      return;
    }
    try {
      await signInWithGoogle();
      goHome();
    } catch (e) {
      Alert.alert(
        "Sign in failed",
        e instanceof Error ? e.message : "Google sign-in was cancelled or failed.",
      );
    }
  };

  const handleEmailAuth = async () => {
    if (!isSupabaseConfigured()) {
      Alert.alert("Not configured", "Add EXPO_PUBLIC_SUPABASE_* to apps/mobile/.env");
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || password.length < 6) {
      Alert.alert("Invalid input", "Enter a valid email and password (6+ characters).");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (mode === "sign-up") {
        const { needsEmailConfirmation } = await signUpWithEmail(trimmedEmail, password);
        if (needsEmailConfirmation) {
          setMessage("Check your email to confirm, then sign in.");
          setMode("sign-in");
          return;
        }
      } else {
        await signInWithEmail(trimmedEmail, password);
      }
      goHome();
    } catch (e) {
      Alert.alert("Sign in failed", e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FadeIn>
            <View style={styles.header}>
              <AppLogo size="md" />
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Welcome to {APP_NAME}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {mode === "sign-up"
                  ? "Create a free account to upload and chat with your documents."
                  : "Sign in to upload documents and start chatting with them instantly."}
              </Text>
            </View>
          </FadeIn>

          <FadeIn delay={60}>
            <View
              style={[
                styles.tabs,
                { backgroundColor: colors.docSearchBg, borderColor: colors.docSearchBorder },
              ]}
            >
              {(["sign-in", "sign-up"] as const).map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => {
                    setMode(tab);
                    setMessage(null);
                  }}
                  style={[
                    styles.tab,
                    mode === tab && { backgroundColor: colors.brandPrimary },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: mode === tab ? "#fff" : colors.textSecondary },
                    ]}
                  >
                    {tab === "sign-in" ? "Sign in" : "Sign up"}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.docSearchBg,
                  borderColor: colors.docSearchBorder,
                },
              ]}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={mode === "sign-up" ? "At least 6 characters" : "Your password"}
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
              autoComplete={mode === "sign-up" ? "new-password" : "password"}
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.docSearchBg,
                  borderColor: colors.docSearchBorder,
                },
              ]}
            />

            {message ? (
              <Text style={[styles.message, { color: colors.brandPrimary }]}>{message}</Text>
            ) : null}

            <Pressable
              onPress={() => void handleEmailAuth()}
              disabled={loading}
              style={[styles.emailBtn, { backgroundColor: colors.brandPrimary }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.emailBtnText}>
                  {mode === "sign-up" ? "Create account" : "Sign in with email"}
                </Text>
              )}
            </Pressable>

            <View style={styles.orRow}>
              <View style={[styles.orLine, { backgroundColor: colors.docSearchBorder }]} />
              <Text style={[styles.orText, { color: colors.textTertiary }]}>or</Text>
              <View style={[styles.orLine, { backgroundColor: colors.docSearchBorder }]} />
            </View>

            <GoogleSignInButton onPress={() => void handleGoogleSignIn()} />
          </FadeIn>

          <View style={styles.features}>
            {FEATURES.map((f, i) => (
              <StaggerIn key={f.title} index={i} baseDelay={80}>
                <View style={styles.featureRow}>
                  <View
                    style={[
                      styles.featureIcon,
                      {
                        backgroundColor: colors.authFeatureIconBg,
                        borderColor: colors.authFeatureIconBorder,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={f.icon}
                      size={22}
                      color={colors.brandPrimary}
                    />
                  </View>
                  <View style={styles.featureText}>
                    <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                      {f.title}
                    </Text>
                    <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                      {f.description}
                    </Text>
                  </View>
                </View>
              </StaggerIn>
            ))}
          </View>

          <FadeIn delay={320} style={styles.footer}>
            <Text style={[styles.legal, { color: colors.textFooter }]}>
              By continuing you agree to our Terms & Privacy Policy
            </Text>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32, flexGrow: 1 },
  header: { alignItems: "center", paddingTop: 24 },
  title: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 300,
  },
  tabs: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginTop: 24,
    marginBottom: 12,
  },
  tab: { flex: 1, borderRadius: 8, paddingVertical: 10, alignItems: "center" },
  tabText: { fontSize: 14, fontWeight: "600" },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 10,
  },
  message: { fontSize: 13, marginBottom: 8, textAlign: "center" },
  emailBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  emailBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  orRow: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 20 },
  orLine: { flex: 1, height: 1 },
  orText: { fontSize: 12 },
  features: { marginTop: 32, gap: 24 },
  featureRow: { flexDirection: "row", gap: 16 },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { flex: 1, paddingTop: 2 },
  featureTitle: { fontSize: 16, fontWeight: "600" },
  featureDesc: { marginTop: 4, fontSize: 14, lineHeight: 20 },
  footer: { marginTop: "auto", paddingTop: 40, width: "100%" },
  legal: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});

