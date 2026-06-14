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


class GeneralChatMessage(BaseModel):
    """A prior turn in a document-less conversation."""

    role: str = Field(..., max_length=20)
    content: str = Field(..., min_length=1, max_length=8000)


class GeneralChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=4000)
    # Recent turns for context; capped to keep prompts small and bounded.
    history: list[GeneralChatMessage] = Field(default_factory=list, max_length=20)


class GeneralChatResponse(BaseModel):
    answer: str
    follow_up_questions: list[str] = Field(default_factory=list)
