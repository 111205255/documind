from fastapi import APIRouter, Depends, File, Header, HTTPException, Request, UploadFile

from app.api.deps import (
    require_document_access,
    require_gemini,
    settings_dep,
    user_dep,
    verify_api_key,
)
from app.config import Settings
from app.limiter import limiter
from app.schemas.documents import IngestResponse, IngestTextRequest, IngestUrlRequest, parse_document_id
from app.services.rag import ingest_docx_bytes, ingest_pdf_bytes, ingest_text
from app.services.rag.url_loader import fetch_url_text
from app.services.vector_store import delete_document_chunks, get_vector_store

router = APIRouter()

DOCX_MIME = ("application/vnd.openxmlformats-officedocument.wordprocessingml.document",)
LEGACY_DOC_MIME = ("application/msword",)
PDF_MIME = ("application/pdf", "application/octet-stream", None)


def _is_pdf(file: UploadFile) -> bool:
    if file.content_type in PDF_MIME:
        return True
    return (file.filename or "").lower().endswith(".pdf")


def _is_docx(file: UploadFile) -> bool:
    if file.content_type in DOCX_MIME:
        return True
    return (file.filename or "").lower().endswith(".docx")


def _is_legacy_doc(file: UploadFile) -> bool:
    if file.content_type in LEGACY_DOC_MIME:
        return True
    name = (file.filename or "").lower()
    return name.endswith(".doc") and not name.endswith(".docx")


def _ingest_error(exc: Exception) -> HTTPException:
    err = str(exc)
    if "429" in err or "quota" in err.lower():
        return HTTPException(
            status_code=429,
            detail="Gemini quota exceeded. Wait 30 seconds and retry.",
        )
    return HTTPException(status_code=500, detail="Ingest failed. Please try again later.")


def _is_pdf_bytes(data: bytes) -> bool:
    return data[:5] == b"%PDF-"


@router.post("/{document_id}/ingest", response_model=IngestResponse)
@limiter.limit("5/minute")
async def ingest_document(
    request: Request,
    document_id: str,
    file: UploadFile = File(...),
    title: str | None = None,
    settings: Settings = Depends(settings_dep),
    user_id: str | None = Depends(user_dep),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
    authorization: str | None = Header(default=None),
) -> IngestResponse:
    """Index a PDF or Word (.docx) file for RAG."""
    document_id = parse_document_id(document_id)
    verify_api_key(settings, x_api_key, authorization)
    require_gemini(settings)
    require_document_access(settings, document_id, user_id)

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file.")
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(status_code=413, detail="File exceeds maximum upload size.")

    if _is_legacy_doc(file):
        raise HTTPException(
            status_code=400,
            detail="Legacy .doc files are not supported. Save as .docx and upload again.",
        )

    doc_title = title or file.filename

    try:
        if _is_docx(file):
            result = ingest_docx_bytes(
                settings,
                document_id=document_id,
                data=data,
                title=doc_title,
            )
        elif _is_pdf(file):
            if not _is_pdf_bytes(data):
                raise HTTPException(status_code=400, detail="File is not a valid PDF.")
            result = ingest_pdf_bytes(
                settings,
                document_id=document_id,
                data=data,
                title=doc_title,
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and Word (.docx) files are supported.",
            )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    except HTTPException:
        raise
    except Exception as e:
        raise _ingest_error(e) from e

    return IngestResponse(**result)


@router.post("/{document_id}/ingest-url", response_model=IngestResponse)
@limiter.limit("5/minute")
async def ingest_document_url(
    request: Request,
    document_id: str,
    body: IngestUrlRequest,
    settings: Settings = Depends(settings_dep),
    user_id: str | None = Depends(user_dep),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
    authorization: str | None = Header(default=None),
) -> IngestResponse:
    """Fetch a public URL and index its text for RAG."""
    document_id = parse_document_id(document_id)
    verify_api_key(settings, x_api_key, authorization)
    require_gemini(settings)
    require_document_access(settings, document_id, user_id)

    url = body.url.strip()
    if not url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")

    try:
        text = fetch_url_text(url)
        result = ingest_text(
            settings,
            document_id=document_id,
            text=text,
            title=body.title or url,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    except HTTPException:
        raise
    except Exception as e:
        raise _ingest_error(e) from e

    return IngestResponse(**result)


@router.post("/{document_id}/ingest-text", response_model=IngestResponse)
def ingest_document_text(
    document_id: str,
    body: IngestTextRequest,
    settings: Settings = Depends(settings_dep),
    user_id: str | None = Depends(user_dep),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
    authorization: str | None = Header(default=None),
) -> IngestResponse:
    """Index plain text (dev/tests or pre-extracted content)."""
    document_id = parse_document_id(document_id)
    verify_api_key(settings, x_api_key, authorization)
    require_gemini(settings)
    require_document_access(settings, document_id, user_id)

    try:
        result = ingest_text(
            settings,
            document_id=document_id,
            text=body.text,
            title=body.title,
        )
    except Exception as e:
        raise _ingest_error(e) from e

    return IngestResponse(**result)


@router.delete("/{document_id}")
def delete_document_index(
    document_id: str,
    settings: Settings = Depends(settings_dep),
    user_id: str | None = Depends(user_dep),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
    authorization: str | None = Header(default=None),
) -> dict:
    """Remove all vector chunks for a document."""
    document_id = parse_document_id(document_id)
    verify_api_key(settings, x_api_key, authorization)
    require_document_access(settings, document_id, user_id)

    store = get_vector_store(settings)
    try:
        removed = delete_document_chunks(store, document_id)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

    return {
        "status": "deleted",
        "document_id": document_id,
        "chunks_removed": removed,
    }
