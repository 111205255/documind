import { useRouter, useSegments } from "expo-router";
import { useEffect, type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../lib/env";

const PUBLIC_SEGMENTS = new Set(["", "login", "auth", "connection"]);

/** Redirect unauthenticated users to login. */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { session, loading } = useAuth();

  const root = segments[0] ?? "";
  const isPublic = PUBLIC_SEGMENTS.has(root);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;
    if (loading) return;
    if (!session && !isPublic) {
      router.replace("/login");
      return;
    }
    if (session && root === "login") {
      router.replace("/home");
    }
  }, [session, loading, isPublic, root, router, configured]);

  if (!configured) {
    return null;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session && !isPublic) {
    return null;
  }

  return children;
}
