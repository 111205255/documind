import httpx
from fastapi import HTTPException

from app.config import Settings
from app.services.rag.ingest import ingest_docx_bytes, ingest_pdf_bytes, ingest_text
from app.services.rag.url_loader import fetch_url_text
from app.services.vector_store import get_vector_store

DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
PDF_MIME = "application/pdf"
URL_MIME = "application/x-documind-url"


def _chunk_count(settings: Settings, document_id: str) -> int:
    store = get_vector_store(settings)
    try:
        existing = store._collection.get(where={"document_id": {"$eq": document_id}})
        return len(existing.get("ids") or [])
    except Exception:
        return 0


def _fetch_document(settings: Settings, document_id: str) -> dict:
    base = settings.supabase_url.rstrip("/")
    headers = {
        "apikey": settings.supabase_service_role_key,
        "Authorization": f"Bearer {settings.supabase_service_role_key}",
    }
    params = {"id": f"eq.{document_id}", "select": "*"}

    with httpx.Client(timeout=30.0) as client:
        response = client.get(f"{base}/rest/v1/documents", headers=headers, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=503, detail="Could not load document metadata.")

    rows = response.json()
    if not rows:
        raise HTTPException(status_code=404, detail="Document not found.")
    return rows[0]


def _download_file(settings: Settings, storage_path: str) -> bytes:
    base = settings.supabase_url.rstrip("/")
    headers = {
        "apikey": settings.supabase_service_role_key,
        "Authorization": f"Bearer {settings.supabase_service_role_key}",
    }
    url = f"{base}/storage/v1/object/documents/{storage_path}"

    with httpx.Client(timeout=60.0) as client:
        response = client.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=503, detail="Could not download document for re-indexing.")
    return response.content


def ensure_document_indexed(settings: Settings, document_id: str) -> bool:
    """Re-index from Supabase storage when Chroma has no chunks (e.g. after Render restart)."""
    if not settings.supabase_url.strip() or not settings.supabase_service_role_key.strip():
        return False

    if _chunk_count(settings, document_id) > 0:
        return False

    doc = _fetch_document(settings, document_id)
    mime = doc.get("mime_type") or ""
    title = doc.get("title") or doc.get("file_name") or "Document"
    storage_path = doc.get("storage_path") or ""

    if mime == URL_MIME:
        source_url = doc.get("file_name") or ""
        if not source_url:
            return False
        text = fetch_url_text(source_url)
        ingest_text(settings, document_id=document_id, text=text, title=title)
        return True

    if not storage_path:
        return False

    data = _download_file(settings, storage_path)
    if mime == DOCX_MIME or storage_path.lower().endswith(".docx"):
        ingest_docx_bytes(settings, document_id=document_id, data=data, title=title)
    elif mime == PDF_MIME or storage_path.lower().endswith(".pdf"):
        ingest_pdf_bytes(settings, document_id=document_id, data=data, title=title)
    else:
        return False

    return _chunk_count(settings, document_id) > 0
