from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.api.deps import require_openai, settings_dep
from app.config import Settings
from app.schemas.documents import IngestResponse, IngestTextRequest
from app.services.rag import ingest_docx_bytes, ingest_pdf_bytes, ingest_text

router = APIRouter()

WORD_MIME = (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
)
PDF_MIME = ("application/pdf", "application/octet-stream", None)


def _is_pdf(file: UploadFile) -> bool:
    if file.content_type in PDF_MIME:
        return True
    return (file.filename or "").lower().endswith(".pdf")


def _is_docx(file: UploadFile) -> bool:
    if file.content_type in WORD_MIME:
        return True
    name = (file.filename or "").lower()
    return name.endswith(".docx") or name.endswith(".doc")


@router.post("/{document_id}/ingest", response_model=IngestResponse)
async def ingest_document(
    document_id: str,
    file: UploadFile = File(...),
    title: str | None = None,
    settings: Settings = Depends(settings_dep),
) -> IngestResponse:
    """
    Index a PDF or Word file for RAG (Blueprint Step 4).

    Called after Step 3 upload to Supabase storage — pass the same `document_id`.
    """
    require_openai(settings)

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file.")

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
        raise HTTPException(status_code=500, detail=f"Ingest failed: {e}") from e

    return IngestResponse(**result)


@router.post("/{document_id}/ingest-text", response_model=IngestResponse)
def ingest_document_text(
    document_id: str,
    body: IngestTextRequest,
    settings: Settings = Depends(settings_dep),
) -> IngestResponse:
    """Index plain text (dev/tests or pre-extracted content)."""
    require_openai(settings)

    try:
        result = ingest_text(
            settings,
            document_id=document_id,
            text=body.text,
            title=body.title,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingest failed: {e}") from e

    return IngestResponse(**result)
