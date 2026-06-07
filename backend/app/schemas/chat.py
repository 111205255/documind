from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    document_id: str = Field(..., min_length=1)
    question: str = Field(..., min_length=1, max_length=4000)
    user_id: str | None = None


class CitationOut(BaseModel):
    id: str
    document_id: str
    page: int
    excerpt: str
    index: int


class ChatResponse(BaseModel):
    answer: str
    citations: list[CitationOut]
