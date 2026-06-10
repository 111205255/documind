import { supabase } from "./client";

export type ThreadRow = {
  id: string;
  document_id: string;
  title: string;
  updated_at: string;
  last_message_preview?: string;
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
    .select("id, document_id, title, updated_at, last_message_preview")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (!threads?.length) return [];

  return threads.map((t) => ({
    id: t.id,
    documentId: t.document_id,
    title: t.title,
    preview: t.last_message_preview?.slice(0, 80) || "No messages yet",
  }));
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
  citations?: { excerpt: string; page: number; index: number }[];
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
    const mapped = citations.map((c, index) => {
      const item = c as { page?: number; excerpt?: string; index?: number };
      return {
        excerpt: item.excerpt ?? "",
        page: item.page ?? 1,
        index: item.index ?? index,
      };
    });
    const first = mapped[0];
    return {
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content,
      pageTag: first ? `p.${first.page}` : undefined,
      citations: mapped.length ? mapped : undefined,
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
  await supabase
    .from("chat_threads")
    .update({
      updated_at: new Date().toISOString(),
      last_message_preview: content.slice(0, 120),
    })
    .eq("id", threadId);
}
