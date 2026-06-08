/** Turn raw API error bodies into short user-facing messages. */
export function formatApiError(raw: string): string {
  const text = raw.trim();
  if (!text) return "Something went wrong. Please try again.";

  if (text.includes("429") || text.toLowerCase().includes("quota")) {
    return "Gemini API quota reached. Wait 30 seconds and try again. If this keeps happening, set GEMINI_MODEL=gemini-2.5-flash on Render.";
  }

  try {
    const parsed = JSON.parse(text) as { detail?: string };
    if (typeof parsed.detail === "string") {
      return formatApiError(parsed.detail);
    }
  } catch {
    // not JSON
  }

  if (text.length > 280) return `${text.slice(0, 280)}…`;
  return text;
}
