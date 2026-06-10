import { DOCUMIND_URL_MIME } from "@/lib/supabase/constants";
import { createClient } from "@/services/supabase/client";
import type { DocumentRow } from "./types";

export type UploadUrlResult = {
  document: DocumentRow;
};

function titleFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host || "Web page";
  } catch {
    return "Web page";
  }
}

export async function uploadUrlDocument(url: string): Promise<UploadUrlResult> {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    throw new Error("URL must start with http:// or https://");
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Sign in before adding a link.");
  }

  const documentId = crypto.randomUUID();
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
      status: "ready",
    })
    .select("*")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "Failed to save link.");
  }

  return { document: inserted as DocumentRow };
}
