import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { GradientBackground } from "../components/GradientBackground";
import { ScreenHeader } from "../components/ScreenHeader";
import { SettingsToggle } from "../components/SettingsToggle";
import { navigate } from "../lib/nav";
import { signOut } from "../lib/supabase/auth";
import { isSupabaseConfigured } from "../lib/env";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import { settingsCardShadow } from "../theme/shadows";
import { useMemo, useState } from "react";
import { AnimatedMaterialIcon, FadeIn, PressableScale, StaggerIn } from "../components/motion";
import { BottomTabBar } from "../components/navigation/BottomTabBar";

function initialsFromUser(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null): string {
  const name = user?.user_metadata?.full_name;
  if (typeof name === "string" && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  const email = user?.email ?? "";
  return email.slice(0, 2).toUpperCase() || "DM";
}

function displayNameFromUser(user: { email?: string | null; user_metadata?: Record<string, unknown> } | null): string {
  const name = user?.user_metadata?.full_name;
  if (typeof name === "string" && name.trim()) return name.trim();
  const email = user?.email ?? "";
  return email.split("@")[0] || "DocuMind user";
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDark, setThemeMode } = useTheme();

  const cardStyle = (bg: string) => [
    styles.card,
    settingsCardShadow(isDark),
    { backgroundColor: bg },
  ];
  const [notifications, setNotifications] = useState(true);

  const initials = useMemo(() => initialsFromUser(user), [user]);
  const displayName = useMemo(() => displayNameFromUser(user), [user]);
  const email = user?.email ?? "Not signed in";

  const navRows = [
    { icon: "shield-outline" as const, label: "Privacy & security" },
    { icon: "help-circle-outline" as const, label: "Help & support" },
  ];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScreenHeader title="Settings" showBack={false} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <StaggerIn index={0}>
          <View style={cardStyle(colors.settingsCardBg)}>
            <PressableScale variant="card" haptic="light" style={styles.profileRow}>
              <View style={[styles.avatar, { backgroundColor: colors.brandPrimary }]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.profileText}>
                <Text style={[styles.name, { color: colors.textPrimary }]}>{displayName}</Text>
                <Text style={[styles.email, { color: colors.textSecondary }]}>{email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.docChevron} />
            </PressableScale>
          </View>
          </StaggerIn>

          <StaggerIn index={1}>
          <View style={cardStyle(colors.settingsCardBg)}>
            <View style={styles.toggleRow}>
              <AnimatedMaterialIcon
                name="bell-outline"
                activeName="bell"
                active={notifications}
                size={22}
                color={colors.textSecondary}
                activeColor={colors.brandPrimary}
              />
              <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>
                Notifications
              </Text>
              <SettingsToggle value={notifications} onValueChange={setNotifications} />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.settingsDivider }]} />
            <View style={styles.toggleRow}>
              <AnimatedMaterialIcon
                name="weather-night"
                activeName="weather-night"
                active={isDark}
                size={22}
                color={colors.textSecondary}
                activeColor={colors.brandPrimary}
              />
              <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Dark mode</Text>
              <SettingsToggle
                value={isDark}
                onValueChange={(on) => setThemeMode(on ? "dark" : "light")}
              />
            </View>
          </View>
          </StaggerIn>

          <StaggerIn index={2}>
          <View style={cardStyle(colors.settingsCardBg)}>
            {navRows.map((row, i) => (
              <View key={row.label}>
                <PressableScale variant="card" haptic="light" style={styles.navRow}>
                  <AnimatedMaterialIcon
                    name={row.icon}
                    size={22}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>
                    {row.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.docChevron} />
                </PressableScale>
                {i < navRows.length - 1 ? (
                  <View
                    style={[styles.divider, { backgroundColor: colors.settingsDivider }]}
                  />
                ) : null}
              </View>
            ))}
          </View>
          </StaggerIn>

          <StaggerIn index={3}>
          <View style={cardStyle(colors.settingsCardBg)}>
            <PressableScale
              variant="card"
              haptic="medium"
              style={styles.navRow}
              onPress={() =>
                Alert.alert("Sign out", "Sign out of DocuMind?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Sign out",
                    style: "destructive",
                    onPress: () => {
                      if (isSupabaseConfigured()) {
                        void signOut();
                      }
                      router.replace("/login");
                    },
                  },
                ])
              }
            >
              <MaterialCommunityIcons
                name="logout"
                size={22}
                color={colors.destructive}
              />
              <Text style={[styles.rowLabel, { color: colors.destructive }]}>Sign out</Text>
            </PressableScale>
          </View>
          </StaggerIn>

          {__DEV__ ? (
            <PressableScale
              onPress={() => navigate("/connection" as never)}
              haptic="light"
              style={{ marginTop: 8 }}
            >
              <Text style={{ color: colors.textTertiary, fontSize: 12, textAlign: "center" }}>
                Preview offline screen (dev)
              </Text>
            </PressableScale>
          ) : null}

          <Text style={[styles.version, { color: colors.textTertiary }]}>DocuMind v1.0.0</Text>
        </ScrollView>

        <BottomTabBar />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 24 },
  pageTitle: { fontSize: 28, fontWeight: "700", marginTop: 8, marginBottom: 20 },
  scroll: { paddingBottom: 120, gap: 16 },
  card: { borderRadius: 20, overflow: "hidden" },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  profileText: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  email: { marginTop: 2, fontSize: 14 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: "500" },
  divider: { height: 1, marginLeft: 52 },
  version: { textAlign: "center", fontSize: 13, marginTop: 24 },
});
