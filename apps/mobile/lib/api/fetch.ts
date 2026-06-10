import { API_URL } from "../env";
import { supabase } from "../supabase/client";

/** Mobile API client — auth via Supabase JWT only (no client-side API key). */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  if (!API_URL) throw new Error("Set EXPO_PUBLIC_API_URL in apps/mobile/.env");

  const headers = new Headers(init?.headers);
  if (API_URL.includes("loca.lt")) {
    headers.set("Bypass-Tunnel-Reminder", "true");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Sign in required.");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  return fetch(`${API_URL}${path}`, { ...init, headers });
}
