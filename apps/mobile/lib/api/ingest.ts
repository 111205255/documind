import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { formatApiError } from "../api-error";
import { apiFetch } from "./fetch";
import { supabase } from "../supabase/client";

export type UploadFileSource =
  | File
  | { uri: string; name: string; type: string };

function appendFileToForm(form: FormData, file: UploadFileSource) {
  if (Platform.OS === "web" && file instanceof File) {
    form.append("file", file);
    return;
  }
  const native = file as { uri: string; name: string; type: string };
  form.append("file", {
    uri: native.uri,
    name: native.name,
    type: native.type,
  } as unknown as Blob);
}

export async function ingestDocumentForRag(
  documentId: string,
  file: UploadFileSource,
): Promise<void> {
  await supabase.from("documents").update({ status: "processing" }).eq("id", documentId);

  const form = new FormData();
  appendFileToForm(form, file);

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

export async function ingestUrlForRag(
  documentId: string,
  url: string,
  title?: string,
): Promise<void> {
  await supabase.from("documents").update({ status: "processing" }).eq("id", documentId);

  const response = await apiFetch(`/api/v1/documents/${documentId}/ingest-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, title }),
  });

  if (!response.ok) {
    await supabase.from("documents").update({ status: "failed" }).eq("id", documentId);
    const detail = await response.text();
    throw new Error(formatApiError(detail) || `URL ingest failed (${response.status})`);
  }

  await supabase.from("documents").update({ status: "ready" }).eq("id", documentId);
}

export async function purgeDocumentIndex(documentId: string): Promise<void> {
  const response = await apiFetch(`/api/v1/documents/${documentId}`, { method: "DELETE" });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(formatApiError(detail) || `Failed to purge index (${response.status})`);
  }
}

export async function downloadDocumentFile(
  storagePath: string,
  fileName: string,
  mimeType: string,
): Promise<UploadFileSource> {
  const { data, error } = await supabase.storage.from("documents").download(storagePath);
  if (error || !data) throw new Error(error?.message ?? "Download failed.");

  if (Platform.OS === "web") {
    return new File([data], fileName, { type: mimeType });
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const localUri = `${FileSystem.cacheDirectory}${Date.now()}-${safeName}`;
  const arrayBuffer = await data.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  await FileSystem.writeAsStringAsync(localUri, btoa(binary), {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { uri: localUri, name: fileName, type: mimeType };
}
