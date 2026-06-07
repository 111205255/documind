import { createClient } from "@/services/supabase/client";
import {
  ALLOWED_UPLOAD_MIME,
  DOCUMENTS_BUCKET,
  MAX_UPLOAD_BYTES,
} from "@/lib/supabase/constants";
import type { DocumentRow } from "./types";

export type UploadResult = {
  document: DocumentRow;
};

function titleFromFileName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
}

export async function uploadDocument(file: File): Promise<UploadResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Sign in before uploading.");
  }

  if (!ALLOWED_UPLOAD_MIME.includes(file.type as (typeof ALLOWED_UPLOAD_MIME)[number])) {
    throw new Error("Only PDF and Word documents are supported in v1.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File must be 50 MB or smaller.");
  }

  const documentId = crypto.randomUUID();
  const storagePath = `${user.id}/${documentId}/${file.name}`;

  const { error: insertError } = await supabase.from("documents").insert({
    id: documentId,
    user_id: user.id,
    title: titleFromFileName(file.name),
    file_name: file.name,
    mime_type: file.type,
    storage_path: storagePath,
    file_size_bytes: file.size,
    page_count: 0,
    status: "uploading",
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    await supabase.from("documents").update({ status: "failed" }).eq("id", documentId);
    throw new Error(uploadError.message);
  }

  const { data: updated, error: updateError } = await supabase
    .from("documents")
    .update({ status: "ready" })
    .eq("id", documentId)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw new Error(updateError?.message ?? "Failed to finalize upload.");
  }

  return { document: updated as DocumentRow };
}
