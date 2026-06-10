import type { User } from "@supabase/supabase-js";

export function initialsFromUser(user: User | null | undefined): string {
  if (!user) return "DM";
  const name =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "User";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase() || "DM";
  }
  return String(name).slice(0, 2).toUpperCase() || "DM";
}
