import { createClient } from "@/services/supabase/client";
import type { Citation, ChatMessage } from "@/types/chat";

type DbCitation = {
  id: string;
  document_id: string;
  page: number;
  excerpt: string;
  index: number;
};

function mapCitation(c: DbCitation): Citation {
  return {
    id: c.id,
    documentId: c.document_id,
    page: c.page,
    excerpt: c.excerpt,
    index: c.index,
  };
}

export async function getOrCreateThread(
  documentId: string,
  title: string,
): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required.");

  const { data: existing } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("user_id", user.id)
    .eq("document_id", documentId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: created, error } = await supabase
    .from("chat_threads")
    .insert({
      user_id: user.id,
      document_id: documentId,
      title,
    })
    .select("id")
    .single();

  if (error || !created) throw new Error(error?.message ?? "Could not create thread.");
  return created.id;
}

export async function loadThreadMessages(threadId: string): Promise<ChatMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    threadId,
    role: row.role as ChatMessage["role"],
    content: row.content,
    citations: Array.isArray(row.citations)
      ? (row.citations as DbCitation[]).map(mapCitation)
      : [],
    createdAt: row.created_at,
    status: "complete" as const,
  }));
}

export async function saveMessage(
  threadId: string,
  role: "user" | "assistant",
  content: string,
  citations: Citation[] = [],
): Promise<void> {
  const supabase = createClient();
  const dbCitations = citations.map((c) => ({
    id: c.id,
    document_id: c.documentId,
    page: c.page,
    excerpt: c.excerpt,
    index: c.index,
  }));

  const { error } = await supabase.from("chat_messages").insert({
    thread_id: threadId,
    role,
    content,
    citations: dbCitations,
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

export type ThreadListItem = {
  id: string;
  documentId: string;
  title: string;
  preview: string;
  updatedAt: string;
};

export async function listUserThreads(): Promise<ThreadListItem[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: threads, error } = await supabase
    .from("chat_threads")
    .select("id, document_id, title, updated_at, last_message_preview")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error || !threads?.length) return [];

  return threads.map((t) => ({
    id: t.id,
    documentId: t.document_id,
    title: t.title,
    preview: t.last_message_preview?.slice(0, 80) || "No messages yet",
    updatedAt: t.updated_at,
  }));
}

export async function deleteThread(threadId: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required.");

  const { error } = await supabase
    .from("chat_threads")
    .delete()
    .eq("id", threadId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
}
