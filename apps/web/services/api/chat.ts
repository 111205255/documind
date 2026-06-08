import { formatApiError } from "@/lib/api-error";
import { getApiUrl } from "@/lib/api-url";
import type { Citation } from "@/types/chat";

type ApiCitation = {
  id: string;
  document_id: string;
  page: number;
  excerpt: string;
  index: number;
};

type ChatApiResponse = {
  answer: string;
  citations: ApiCitation[];
};

function mapCitation(c: ApiCitation): Citation {
  return {
    id: c.id,
    documentId: c.document_id,
    page: c.page,
    excerpt: c.excerpt,
    index: c.index,
  };
}

export async function askDocument(
  documentId: string,
  question: string,
): Promise<{ answer: string; citations: Citation[] }> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    throw new Error("AI backend is not configured (NEXT_PUBLIC_API_URL).");
  }

  const response = await fetch(`${apiUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, question }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(formatApiError(detail) || `Chat failed (${response.status})`);
  }

  const data = (await response.json()) as ChatApiResponse;
  return {
    answer: data.answer,
    citations: data.citations.map(mapCitation),
  };
}
