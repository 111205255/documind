import { formatApiError } from "../api-error";
import { apiFetch } from "./fetch";

export type ApiCitation = {
  id: string;
  document_id: string;
  page: number;
  excerpt: string;
  index: number;
};

export async function askDocument(
  documentId: string,
  question: string,
): Promise<{ answer: string; citations: ApiCitation[] }> {
  const response = await apiFetch("/api/v1/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id: documentId, question }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(formatApiError(detail) || `Chat failed (${response.status})`);
  }

  return response.json() as Promise<{ answer: string; citations: ApiCitation[] }>;
}
