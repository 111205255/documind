from app.services.rag.ingest import ingest_docx_bytes, ingest_pdf_bytes, ingest_text
from app.services.rag.query import answer_general, answer_question

__all__ = [
    "ingest_docx_bytes",
    "ingest_pdf_bytes",
    "ingest_text",
    "answer_question",
    "answer_general",
]
