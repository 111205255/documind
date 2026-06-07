import { createClient } from "@/services/supabase/client";

export async function signInWithEmail(email: string, password: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmail(email: string, password: string): Promise<{
  needsEmailConfirmation: boolean;
}> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;

  const needsEmailConfirmation = !data.session && !!data.user;
  return { needsEmailConfirmation };
}
