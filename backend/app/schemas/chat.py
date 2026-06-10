from uuid import UUID

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    document_id: str = Field(..., min_length=36, max_length=36)
    question: str = Field(..., min_length=1, max_length=4000)

    def validated_document_id(self) -> str:
        try:
            return str(UUID(self.document_id))
        except ValueError as exc:
            from fastapi import HTTPException

            raise HTTPException(status_code=400, detail="Invalid document id.") from exc


class CitationOut(BaseModel):
    id: str
    document_id: str
    page: int
    excerpt: str
    index: int


class ChatResponse(BaseModel):
    answer: str
    citations: list[CitationOut]
    follow_up_questions: list[str] = Field(default_factory=list)
