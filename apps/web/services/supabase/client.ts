import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[DocuMind] Supabase env vars missing. Auth and storage will not work until .env.local is configured.",
      );
    }
    return createBrowserClient(
      url ?? "https://placeholder.supabase.co",
      key ?? "placeholder",
    );
  }

  return createBrowserClient(url, key);
}
