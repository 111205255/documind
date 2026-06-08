from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import require_gemini, settings_dep
from app.config import Settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag import answer_question

router = APIRouter()


@router.post("", response_model=ChatResponse)
def chat(
    body: ChatRequest,
    settings: Settings = Depends(settings_dep),
) -> ChatResponse:
    """
    Ask a question against an indexed document (Blueprint Step 4 → Step 5 UI).

    Returns answer text plus page citations from retrieved chunks.
    """
    require_gemini(settings)

    try:
        result = answer_question(
            settings,
            document_id=body.document_id,
            question=body.question.strip(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {e}") from e

    return ChatResponse(**result)
