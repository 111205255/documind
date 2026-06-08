/** Browser uses same-origin proxy (/api/rag/* → backend /api/v1/*). Server hits backend directly. */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/rag";
  }
  const backend =
    process.env.RAG_API_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:8000";
  return `${backend}/api/v1`;
}

export function isApiConfigured(): boolean {
  if (typeof window !== "undefined") return true;
  return Boolean(
    process.env.RAG_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NODE_ENV === "development",
  );
}
