import { formatApiError } from "@/lib/api-error";
import { getApiUrl } from "@/lib/api-url";
import { getRagHeaders } from "@/lib/rag-headers";
import { createClient } from "@/services/supabase/client";

export type IngestResult = {
  document_id: string;
  status: string;
  chunk_count: number;
  title?: string;
};

export async function ingestDocumentForRag(
  documentId: string,
  file: File,
): Promise<IngestResult> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    throw new Error("AI backend is not configured (NEXT_PUBLIC_API_URL).");
  }

  const supabase = createClient();
  await supabase.from("documents").update({ status: "processing" }).eq("id", documentId);

  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${apiUrl}/documents/${documentId}/ingest`, {
    method: "POST",
    headers: await getRagHeaders(),
    body: form,
  });

  if (!response.ok) {
    await supabase.from("documents").update({ status: "failed" }).eq("id", documentId);
    const detail = await response.text();
    throw new Error(formatApiError(detail) || `Ingest failed (${response.status})`);
  }

  const result = (await response.json()) as IngestResult;
  await supabase.from("documents").update({ status: "ready" }).eq("id", documentId);
  return result;
}

export async function ingestUrlForRag(
  documentId: string,
  url: string,
  title?: string,
): Promise<IngestResult> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    throw new Error("AI backend is not configured (NEXT_PUBLIC_API_URL).");
  }

  const supabase = createClient();
  await supabase.from("documents").update({ status: "processing" }).eq("id", documentId);

  const response = await fetch(`${apiUrl}/documents/${documentId}/ingest-url`, {
    method: "POST",
    headers: await getRagHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ url, title }),
  });

  if (!response.ok) {
    await supabase.from("documents").update({ status: "failed" }).eq("id", documentId);
    const detail = await response.text();
    throw new Error(formatApiError(detail) || `URL ingest failed (${response.status})`);
  }

  const result = (await response.json()) as IngestResult;
  await supabase.from("documents").update({ status: "ready" }).eq("id", documentId);
  return result;
}

export async function purgeDocumentIndex(documentId: string): Promise<void> {
  const apiUrl = getApiUrl();
  if (!apiUrl) return;

  await fetch(`${apiUrl}/documents/${documentId}`, {
    method: "DELETE",
    headers: await getRagHeaders(),
  });
}

export async function downloadDocumentFile(
  storagePath: string,
  fileName: string,
  mimeType: string,
): Promise<File> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("documents").download(storagePath);
  if (error || !data) {
    throw new Error(error?.message ?? "Could not download document from storage.");
  }
  return new File([data], fileName, { type: mimeType });
}
