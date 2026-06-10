import re
import uuid

from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import Settings
from app.schemas.chat import CitationOut
from app.services.rag.reindex import ensure_document_indexed
from app.services.vector_store import get_vector_store

SYSTEM_PROMPT = """You are DocuMind, an AI assistant that answers questions ONLY using the provided document excerpts.

Rules:
- Answer in clear, concise plain language.
- If the excerpts do not contain enough information, say you cannot find it in the document.
- Do not invent facts or page numbers.
- When you use information from an excerpt, reference it with [1], [2], etc. matching the excerpt numbers below.
"""

USER_PROMPT = """Document excerpts:
{context}

Question: {question}

Answer with citation markers [n] where n matches the excerpt numbers.

After your answer, add a new line exactly like this:
FOLLOWUPS: short question 1 | short question 2 | short question 3"""


def _format_context(docs: list[Document]) -> str:
    parts: list[str] = []
    for i, doc in enumerate(docs, start=1):
        page = doc.metadata.get("page", "?")
        parts.append(f"[{i}] (page {page})\n{doc.page_content}")
    return "\n\n".join(parts)


def _build_citations(docs: list[Document], document_id: str) -> list[CitationOut]:
    citations: list[CitationOut] = []
    for i, doc in enumerate(docs):
        page = int(doc.metadata.get("page", 1))
        excerpt = doc.page_content[:500].strip()
        if len(doc.page_content) > 500:
            excerpt += "…"
        citations.append(
            CitationOut(
                id=str(uuid.uuid4()),
                document_id=document_id,
                page=page,
                excerpt=excerpt,
                index=i,
            )
        )
    return citations


def _parse_citation_refs(answer: str, max_index: int) -> set[int]:
    refs = set(int(m) for m in re.findall(r"\[(\d+)\]", answer))
    return {r for r in refs if 1 <= r <= max_index}


def _split_answer_and_followups(raw: str) -> tuple[str, list[str]]:
    match = re.search(r"\nFOLLOWUPS:\s*(.+)$", raw, re.IGNORECASE | re.DOTALL)
    if not match:
        return raw.strip(), []

    answer = raw[: match.start()].strip()
    followups = [q.strip() for q in match.group(1).split("|") if q.strip()]
    return answer, followups[:3]


def answer_question(
    settings: Settings,
    document_id: str,
    question: str,
) -> dict:
    """Retrieve relevant chunks → Gemini → answer with citations (Blueprint RAG)."""
    store = get_vector_store(settings)
    retriever = store.as_retriever(
        search_kwargs={
            "k": settings.retrieval_k,
            "filter": {"document_id": {"$eq": document_id}},
        }
    )

    docs: list[Document] = retriever.invoke(question)
    if not docs:
        if ensure_document_indexed(settings, document_id):
            docs = retriever.invoke(question)
    if not docs:
        return {
            "answer": "I could not find relevant content in this document. Try re-uploading or asking a different question.",
            "citations": [],
            "follow_up_questions": [],
        }

    context = _format_context(docs)
    llm = ChatGoogleGenerativeAI(
        google_api_key=settings.google_api_key,
        model=settings.gemini_model,
        temperature=0.2,
    )
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            ("human", USER_PROMPT),
        ]
    )
    chain = prompt | llm
    result = chain.invoke({"context": context, "question": question})
    raw_answer = result.content if hasattr(result, "content") else str(result)
    answer, follow_ups = _split_answer_and_followups(raw_answer)

    all_citations = _build_citations(docs, document_id)
    used = _parse_citation_refs(answer, len(docs))
    if used:
        citations = [all_citations[i - 1] for i in sorted(used)]
    else:
        citations = all_citations[:3]

    return {
        "answer": answer.strip(),
        "citations": citations,
        "follow_up_questions": follow_ups,
    }
