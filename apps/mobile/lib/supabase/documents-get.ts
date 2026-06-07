import type { DocumentRow } from "./types";
import { supabase } from "./client";

export async function getDocumentById(id: string): Promise<DocumentRow | null> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as DocumentRow | null;
}
