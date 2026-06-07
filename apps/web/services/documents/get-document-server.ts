import { createClient } from "@/services/supabase/server";
import type { DocumentRow } from "./types";

export async function getDocumentById(id: string): Promise<DocumentRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[DocuMind] get document:", error.message);
    return null;
  }

  return data as DocumentRow | null;
}
