from pydantic import BaseModel, Field


class IngestTextRequest(BaseModel):
    """Index plain text for a document (testing or URL-extracted content)."""

    text: str = Field(..., min_length=1)
    title: str | None = None


class IngestResponse(BaseModel):
    document_id: str
    status: str = "indexed"
    chunk_count: int
    title: str | None = None
