import { createClient } from "@/services/supabase/client";
import { DOCUMIND_URL_MIME, DOCUMENTS_BUCKET } from "@/lib/supabase/constants";

export type DocumentViewInfo = {
  mimeType: string;
  pageCount: number;
  signedUrl: string | null;
  sourceUrl: string | null;
};

export async function getDocumentViewInfo(documentId: string): Promise<DocumentViewInfo | null> {
  const supabase = createClient();
  const { data: doc, error } = await supabase
    .from("documents")
    .select("mime_type, page_count, storage_path, file_name")
    .eq("id", documentId)
    .maybeSingle();

  if (error || !doc) return null;

  if (doc.mime_type === DOCUMIND_URL_MIME) {
    return {
      mimeType: doc.mime_type,
      pageCount: doc.page_count || 0,
      signedUrl: null,
      sourceUrl: doc.file_name,
    };
  }

  const { data: signed } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(doc.storage_path, 3600);

  return {
    mimeType: doc.mime_type,
    pageCount: doc.page_count || 0,
    signedUrl: signed?.signedUrl ?? null,
    sourceUrl: null,
  };
}
