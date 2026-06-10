export const DOCUMENTS_BUCKET = "documents";

export const ALLOWED_UPLOAD_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
] as const;

/** URL-backed documents (no storage file). */
export const DOCUMIND_URL_MIME = "application/x-documind-url" as const;

export const INGESTIBLE_MIME_TYPES = [...ALLOWED_UPLOAD_MIME, DOCUMIND_URL_MIME] as const;

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
