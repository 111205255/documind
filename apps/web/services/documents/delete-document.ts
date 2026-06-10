import { purgeDocumentIndex } from "@/services/api/ingest-document";

import { createClient } from "@/services/supabase/client";

import { DOCUMENTS_BUCKET } from "@/lib/supabase/constants";



export async function deleteDocument(documentId: string): Promise<void> {

  const supabase = createClient();

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



  if (doc.mime_type !== "application/x-documind-url") {

    const { error: storageError } = await supabase.storage

      .from(DOCUMENTS_BUCKET)

      .remove([doc.storage_path]);



    if (storageError) throw new Error(storageError.message);

  }



  try {

    await purgeDocumentIndex(documentId);

  } catch {

    // Best-effort vector cleanup after DB row is removed.

  }

}

