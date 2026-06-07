export type DocumentStatus =
  | "uploading"
  | "processing"
  | "ready"
  | "failed";

export interface Document {
  id: string;
  title: string;
  fileName: string;
  mimeType: string;
  pageCount?: number;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
}

/** UI list row — home / library screen */
export interface DocumentListItem {
  id: string;
  title: string;
  pageCount: number;
  relativeTime: string;
}
