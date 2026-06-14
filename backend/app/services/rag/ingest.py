import io
import logging
from shutil import which
from typing import Any

import fitz  # PyMuPDF — robust text extraction + page rendering for OCR.
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from docx import Document as DocxDocument

from app.config import Settings
from app.services.vector_store import add_chunks, delete_document_chunks, get_vector_store

logger = logging.getLogger(__name__)

# A page with fewer than this many characters is treated as "no real text"
# and routed to the OCR fallback (covers image-only / vector-outlined PDFs
# such as design resumes exported from Figma/Canva and scanned documents).
_MIN_PAGE_TEXT_CHARS = 12
# Cap OCR work so a huge scanned file cannot exhaust the free-tier instance.
_MAX_OCR_PAGES = 40
_OCR_DPI = 200


def _split_documents(
    documents: list[Document],
    settings: Settings,
) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    return splitter.split_documents(documents)


def _ocr_available() -> bool:
    """True only when both pytesseract and the tesseract binary are present."""
    try:
        import pytesseract  # noqa: F401
    except Exception:
        return False
    return which("tesseract") is not None


def _ocr_page(page: "fitz.Page") -> str:
    import pytesseract
    from PIL import Image

    pix = page.get_pixmap(dpi=_OCR_DPI)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    return (pytesseract.image_to_string(img) or "").strip()


def _pdf_to_documents(data: bytes) -> list[Document]:
    """Extract text with PyMuPDF, falling back to OCR for image-only pages."""
    docs: list[Document] = []
    ocr_pages: list[int] = []

    with fitz.open(stream=data, filetype="pdf") as pdf:
        for page_num in range(1, pdf.page_count + 1):
            page = pdf[page_num - 1]
            text = (page.get_text("text") or "").strip()
            if len(text) >= _MIN_PAGE_TEXT_CHARS:
                docs.append(Document(page_content=text, metadata={"page": page_num}))
            else:
                ocr_pages.append(page_num)

        if ocr_pages and _ocr_available():
            for page_num in ocr_pages[:_MAX_OCR_PAGES]:
                try:
                    ocr_text = _ocr_page(pdf[page_num - 1])
                except Exception:
                    logger.exception("OCR failed for page %s", page_num)
                    continue
                if len(ocr_text) >= _MIN_PAGE_TEXT_CHARS:
                    docs.append(Document(page_content=ocr_text, metadata={"page": page_num}))
        elif ocr_pages:
            logger.warning(
                "%d page(s) had no extractable text and OCR is unavailable.",
                len(ocr_pages),
            )

    docs.sort(key=lambda d: int(d.metadata.get("page", 0)))
    return docs


def _docx_to_documents(data: bytes) -> list[Document]:
    doc = DocxDocument(io.BytesIO(data))
    paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    if not paragraphs:
        return []
    return [Document(page_content="\n\n".join(paragraphs), metadata={"page": 1})]


def ingest_docx_bytes(
    settings: Settings,
    document_id: str,
    data: bytes,
    title: str | None = None,
) -> dict[str, Any]:
    """Index Word (.docx) documents for RAG."""
    raw_docs = _docx_to_documents(data)
    if not raw_docs:
        raise ValueError("No extractable text found in Word document")

    chunks = _split_documents(raw_docs, settings)
    store = get_vector_store(settings)
    delete_document_chunks(store, document_id)
    count = add_chunks(store, document_id, title, chunks)

    return {
        "document_id": document_id,
        "status": "indexed",
        "chunk_count": count,
        "title": title,
    }


def ingest_pdf_bytes(
    settings: Settings,
    document_id: str,
    data: bytes,
    title: str | None = None,
) -> dict[str, Any]:
    """Blueprint Step 4: chunk PDF → embed → ChromaDB."""
    raw_docs = _pdf_to_documents(data)
    if not raw_docs:
        raise ValueError(
            "We couldn't read any text from this PDF. It may be an image-only or "
            "password-protected file. Try a text-based PDF or a .docx version."
        )

    chunks = _split_documents(raw_docs, settings)
    store = get_vector_store(settings)
    delete_document_chunks(store, document_id)
    count = add_chunks(store, document_id, title, chunks)

    return {
        "document_id": document_id,
        "status": "indexed",
        "chunk_count": count,
        "title": title,
    }


def ingest_text(
    settings: Settings,
    document_id: str,
    text: str,
    title: str | None = None,
) -> dict[str, Any]:
    """Index plain text (Word export, pasted content, tests)."""
    raw = [Document(page_content=text.strip(), metadata={"page": 1})]
    chunks = _split_documents(raw, settings)
    store = get_vector_store(settings)
    delete_document_chunks(store, document_id)
    count = add_chunks(store, document_id, title, chunks)

    return {
        "document_id": document_id,
        "status": "indexed",
        "chunk_count": count,
        "title": title,
    }
