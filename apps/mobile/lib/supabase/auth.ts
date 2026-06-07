import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { supabase } from "./client";

WebBrowser.maybeCompleteAuthSession();

function getRedirectTo(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }
  return Linking.createURL("auth/callback");
}

export async function signInWithGoogle(): Promise<void> {
  const redirectTo = getRedirectTo();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: Platform.OS !== "web",
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error("Could not start Google sign-in.");

  if (Platform.OS === "web") {
    window.location.assign(data.url);
    return;
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== "success" || !result.url) {
    throw new Error("Sign-in was cancelled.");
  }

  const url = new URL(result.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) throw exchangeError;
    return;
  }

  const hash = result.url.split("#")[1];
  if (hash) {
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) throw sessionError;
      return;
    }
  }

  throw new Error("Sign-in did not return a session.");
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<{ needsEmailConfirmation: boolean }> {
  const redirectTo =
    Platform.OS === "web" && typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : Linking.createURL("auth/callback");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;

  return { needsEmailConfirmation: !data.session && !!data.user };
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
