import { createClient } from "@/services/supabase/client";
import type { DocumentRow } from "./types";

export async function getDocumentById(id: string): Promise<DocumentRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as DocumentRow | null;
}
