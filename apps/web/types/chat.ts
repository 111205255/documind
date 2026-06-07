export type ChatRole = "user" | "assistant" | "system";

export interface Citation {
  id: string;
  documentId: string;
  page: number;
  excerpt: string;
  index: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  role: ChatRole;
  content: string;
  citations?: Citation[];
  createdAt: string;
  status?: "sending" | "streaming" | "complete" | "error";
}

export interface ChatThread {
  id: string;
  title: string;
  documentId?: string;
  updatedAt: string;
  preview?: string;
}
