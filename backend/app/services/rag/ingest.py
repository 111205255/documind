import io
from typing import Any

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from docx import Document as DocxDocument
from pypdf import PdfReader

from app.config import Settings
from app.services.vector_store import add_chunks, delete_document_chunks, get_vector_store


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


def _pdf_to_documents(data: bytes) -> list[Document]:
    reader = PdfReader(io.BytesIO(data))
    docs: list[Document] = []
    for page_num, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        if not text.strip():
            continue
        docs.append(
            Document(
                page_content=text.strip(),
                metadata={"page": page_num},
            )
        )
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
        raise ValueError("No extractable text found in PDF")

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
