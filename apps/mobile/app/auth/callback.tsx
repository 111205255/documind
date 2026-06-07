import { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase/client";

/** Handles OAuth return (Google sign-in). */
export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    const finish = async (url: string) => {
      try {
        const parsed = new URL(url);
        const code = parsed.searchParams.get("code");
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else {
          const hash = url.split("#")[1];
          if (hash) {
            const params = new URLSearchParams(hash);
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");
            if (accessToken && refreshToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
            }
          }
        }
      } finally {
        router.replace("/home");
      }
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      void finish(window.location.href);
      return;
    }

    void Linking.getInitialURL().then((url) => {
      if (url) void finish(url);
      else router.replace("/login");
    });
  }, [router]);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
