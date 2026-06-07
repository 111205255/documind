export const DOCUMENTS_BUCKET = "documents";

export const ALLOWED_UPLOAD_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
] as const;

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
