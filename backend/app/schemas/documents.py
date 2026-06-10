from uuid import UUID

from pydantic import BaseModel, Field


class IngestTextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500_000)
    title: str | None = None


class IngestUrlRequest(BaseModel):
    url: str = Field(..., min_length=8, max_length=2000)
    title: str | None = None


class IngestResponse(BaseModel):
    document_id: str
    status: str = "indexed"
    chunk_count: int
    title: str | None = None


def parse_document_id(document_id: str) -> str:
    try:
        return str(UUID(document_id))
    except ValueError as exc:
        from fastapi import HTTPException

        raise HTTPException(status_code=400, detail="Invalid document id.") from exc
