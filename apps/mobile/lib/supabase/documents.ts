import * as DocumentPicker from "expo-document-picker";
import { supabase } from "./client";
import {
  ALLOWED_UPLOAD_MIME,
  DOCUMIND_URL_MIME,
  DOCUMENTS_BUCKET,
  MAX_UPLOAD_BYTES,
} from "./constants";
import { rowToListItem, type DocumentRow } from "./types";
import type { DocumentListItem } from "../../data/demo-documents";
import { createUuid } from "../uuid";

function titleFromFileName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
}

export async function listDocuments(): Promise<DocumentListItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DocumentRow[]).map(rowToListItem);
}

function titleFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host || "Web page";
  } catch {
    return "Web page";
  }
}

export async function pickAndUploadDocument(
  pickerType: string | string[],
): Promise<DocumentRow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Sign in with Google before uploading.");
  }

  const picked = await DocumentPicker.getDocumentAsync({
    type: pickerType,
    copyToCacheDirectory: true,
  });

  if (picked.canceled || !picked.assets?.[0]) {
    throw new Error("Upload cancelled.");
  }

  const asset = picked.assets[0];
  const mimeType = asset.mimeType ?? "application/pdf";

  if (!ALLOWED_UPLOAD_MIME.includes(mimeType as (typeof ALLOWED_UPLOAD_MIME)[number])) {
    throw new Error("Only PDF and Word documents are supported in v1.");
  }

  if (asset.size && asset.size > MAX_UPLOAD_BYTES) {
    throw new Error("File must be 50 MB or smaller.");
  }

  const fileName = asset.name;
  const documentId = createUuid();
  const storagePath = `${user.id}/${documentId}/${fileName}`;

  const { error: insertError } = await supabase.from("documents").insert({
    id: documentId,
    user_id: user.id,
    title: titleFromFileName(fileName),
    file_name: fileName,
    mime_type: mimeType,
    storage_path: storagePath,
    file_size_bytes: asset.size ?? null,
    page_count: 0,
    status: "uploading",
  });

  if (insertError) throw new Error(insertError.message);

  const response = await fetch(asset.uri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(storagePath, blob, { contentType: mimeType, upsert: false });

  if (uploadError) {
    await supabase.from("documents").update({ status: "failed" }).eq("id", documentId);
    throw new Error(uploadError.message);
  }

  const { data: updated, error: updateError } = await supabase
    .from("documents")
    .update({ status: "processing" })
    .eq("id", documentId)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw new Error(updateError?.message ?? "Failed to finalize upload.");
  }

  return updated as DocumentRow;
}

export async function pickAndUploadPdf(): Promise<DocumentRow> {
  return pickAndUploadDocument("application/pdf");
}

export async function pickAndUploadWord(): Promise<DocumentRow> {
  return pickAndUploadDocument([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ]);
}

export async function uploadUrlDocument(url: string): Promise<DocumentRow> {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    throw new Error("URL must start with http:// or https://");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in before adding a link.");

  const documentId = createUuid();
  const storagePath = `${user.id}/${documentId}/url`;

  const { data: inserted, error: insertError } = await supabase
    .from("documents")
    .insert({
      id: documentId,
      user_id: user.id,
      title: titleFromUrl(trimmed),
      file_name: trimmed,
      mime_type: DOCUMIND_URL_MIME,
      storage_path: storagePath,
      file_size_bytes: null,
      page_count: 0,
      status: "processing",
    })
    .select("*")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "Failed to save link.");
  }

  return inserted as DocumentRow;
}

export async function deleteDocument(documentId: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required.");

  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("storage_path, mime_type")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!doc) throw new Error("Document not found.");

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .eq("user_id", user.id);

  if (deleteError) throw new Error(deleteError.message);

  if (doc.mime_type !== DOCUMIND_URL_MIME) {
    const { error: storageError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .remove([doc.storage_path]);

    if (storageError) throw new Error(storageError.message);
  }

  try {
    const { purgeDocumentIndex } = await import("../api/ingest");
    await purgeDocumentIndex(documentId);
  } catch {
    // Best-effort vector cleanup after DB row is removed.
  }
}
