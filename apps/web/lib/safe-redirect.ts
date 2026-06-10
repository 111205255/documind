/** Validate a post-login redirect path (blocks open redirects). */
export function safeRedirectPath(next: string | null, fallback = "/home"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  return next;
}
