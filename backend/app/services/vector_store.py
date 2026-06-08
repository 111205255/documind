from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.config import Settings


def get_embeddings(settings: Settings) -> GoogleGenerativeAIEmbeddings:
    return GoogleGenerativeAIEmbeddings(
        google_api_key=settings.google_api_key,
        model=settings.gemini_embedding_model,
    )


def get_vector_store(settings: Settings) -> Chroma:
    return Chroma(
        collection_name=settings.chroma_collection_name,
        embedding_function=get_embeddings(settings),
        persist_directory=settings.chroma_persist_directory,
    )


def delete_document_chunks(store: Chroma, document_id: str) -> None:
    """Remove all chunks for a document before re-indexing."""
    try:
        store._collection.delete(where={"document_id": {"$eq": document_id}})
    except Exception:
        pass


def add_chunks(
    store: Chroma,
    document_id: str,
    title: str | None,
    chunks: list[Document],
) -> int:
    for i, doc in enumerate(chunks):
        doc.metadata["document_id"] = document_id
        doc.metadata["chunk_index"] = i
        if title:
            doc.metadata["title"] = title
        page = doc.metadata.get("page")
        if page is not None:
            doc.metadata["page"] = int(page)

    ids = [f"{document_id}:{i}" for i in range(len(chunks))]
    store.add_documents(chunks, ids=ids)
    return len(chunks)
