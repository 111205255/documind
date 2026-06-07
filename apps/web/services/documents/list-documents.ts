import { createClient } from "@/services/supabase/server";
import { rowToListItem, type DocumentRow } from "./types";
import type { DocumentListItem } from "@/types/document";

export async function listDocumentsForUser(): Promise<DocumentListItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[DocuMind] list documents:", error.message);
    return [];
  }

  return (data as DocumentRow[]).map(rowToListItem);
}
