import { formatApiError } from "../api-error";
import { apiFetch } from "./fetch";
import { supabase } from "../supabase/client";

export async function ingestDocumentForRag(documentId: string, file: File): Promise<void> {

  await supabase.from("documents").update({ status: "processing" }).eq("id", documentId);

  const form = new FormData();
  form.append("file", file);

  const response = await apiFetch(`/api/v1/documents/${documentId}/ingest`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    await supabase.from("documents").update({ status: "failed" }).eq("id", documentId);
    const detail = await response.text();
    throw new Error(formatApiError(detail) || `Ingest failed (${response.status})`);
  }

  await supabase.from("documents").update({ status: "ready" }).eq("id", documentId);
}

export async function downloadDocumentFile(
  storagePath: string,
  fileName: string,
  mimeType: string,
): Promise<File> {
  const { data, error } = await supabase.storage.from("documents").download(storagePath);
  if (error || !data) throw new Error(error?.message ?? "Download failed.");
  return new File([data], fileName, { type: mimeType });
}
