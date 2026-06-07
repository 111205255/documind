import { supabase } from "./client";

export type ThreadRow = {
  id: string;
  document_id: string;
  title: string;
  updated_at: string;
};

export async function listChatThreads(): Promise<
  { id: string; documentId: string; title: string; preview: string }[]
> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: threads } = await supabase
    .from("chat_threads")
    .select("id, document_id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (!threads?.length) return [];

  const results = [];
  for (const t of threads) {
    const { data: msgs } = await supabase
      .from("chat_messages")
      .select("content")
      .eq("thread_id", t.id)
      .order("created_at", { ascending: false })
      .limit(1);
    results.push({
      id: t.id,
      documentId: t.document_id,
      title: t.title,
      preview: msgs?.[0]?.content?.slice(0, 80) ?? "No messages yet",
    });
  }
  return results;
}

export async function getOrCreateThread(documentId: string, title: string): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required.");

  const { data: existing } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("user_id", user.id)
    .eq("document_id", documentId)
    .limit(1)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: created, error } = await supabase
    .from("chat_threads")
    .insert({ user_id: user.id, document_id: documentId, title })
    .select("id")
    .single();

  if (error || !created) throw new Error(error?.message ?? "Could not create thread.");
  return created.id;
}

export type StoredChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  pageTag?: string;
};

export async function loadThreadMessages(threadId: string): Promise<StoredChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, citations")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const citations = Array.isArray(row.citations) ? row.citations : [];
    const first = citations[0] as { page?: number } | undefined;
    return {
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content,
      pageTag: first?.page ? `p.${first.page}` : undefined,
    };
  });
}

export async function saveChatMessage(
  threadId: string,
  role: "user" | "assistant",
  content: string,
  citations: unknown[] = [],
): Promise<void> {
  const { error } = await supabase.from("chat_messages").insert({
    thread_id: threadId,
    role,
    content,
    citations,
  });
  if (error) throw new Error(error.message);
  await supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);
}
