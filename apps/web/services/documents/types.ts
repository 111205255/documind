import { formatRelativeTime } from "@/lib/format-relative-time";
import type { DocumentListItem, DocumentStatus } from "@/types/document";

export type DocumentRow = {
  id: string;
  user_id: string;
  title: string;
  file_name: string;
  mime_type: string;
  storage_path: string;
  page_count: number;
  file_size_bytes: number | null;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
};

export function rowToListItem(row: DocumentRow): DocumentListItem {
  return {
    id: row.id,
    title: row.title,
    pageCount: row.page_count || 0,
    relativeTime: formatRelativeTime(row.created_at),
  };
}
