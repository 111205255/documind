import { createClient } from "@/services/supabase/client";

export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient();
  const redirectTo = `${window.location.origin}/auth/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) throw error;
}
