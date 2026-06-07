/** Browser calls same-origin proxy; server can hit backend directly. */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/rag";
  }
  return (
    process.env.RAG_API_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:8000"
  );
}

export function isApiConfigured(): boolean {
  if (typeof window !== "undefined") return true;
  return Boolean(
    process.env.RAG_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NODE_ENV === "development",
  );
}
