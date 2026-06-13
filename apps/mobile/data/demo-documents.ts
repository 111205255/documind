// Shared document list shape. Demo/placeholder document data has been removed —
// the app now renders only real documents from Supabase.
export type DocumentListItem = {
  id: string;
  title: string;
  pageCount: number;
  relativeTime: string;
  status?: "uploading" | "processing" | "ready" | "failed";
};
