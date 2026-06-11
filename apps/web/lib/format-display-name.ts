/** Format a readable display name from auth metadata or email local-part */
export function formatDisplayName(
  metadata?: { full_name?: string; name?: string } | null,
  email?: string | null,
): string {
  const fromMeta = metadata?.full_name ?? metadata?.name;
  if (fromMeta?.trim()) return fromMeta.trim();

  const local = email?.split("@")[0];
  if (!local) return "Account";

  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
