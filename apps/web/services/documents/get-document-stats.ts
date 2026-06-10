import { createClient } from "@/services/supabase/server";

export async function getDocumentQuestionCount(documentId: string): Promise<number> {
  const supabase = await createClient();
  const { data: threads } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("document_id", documentId);

  if (!threads?.length) return 0;

  const threadIds = threads.map((t) => t.id);
  const { count } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .in("thread_id", threadIds)
    .eq("role", "user");

  return count ?? 0;
}
