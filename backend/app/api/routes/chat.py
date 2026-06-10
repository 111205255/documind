from fastapi import APIRouter, Depends, Header, HTTPException, Request

from app.api.deps import (
    require_document_access,
    require_gemini,
    settings_dep,
    user_dep,
    verify_api_key,
)
from app.config import Settings
from app.limiter import limiter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag import answer_question

router = APIRouter()


@router.post("", response_model=ChatResponse)
@limiter.limit("20/minute")
def chat(
    request: Request,
    body: ChatRequest,
    settings: Settings = Depends(settings_dep),
    user_id: str | None = Depends(user_dep),
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
) -> ChatResponse:
    """
    Ask a question against an indexed document (Blueprint Step 4 → Step 5 UI).

    Returns answer text plus page citations from retrieved chunks.
    """
    verify_api_key(settings, x_api_key)
    require_gemini(settings)
    document_id = body.validated_document_id()
    require_document_access(settings, document_id, user_id)

    try:
        result = answer_question(
            settings,
            document_id=document_id,
            question=body.question.strip(),
        )
    except Exception as e:
        err = str(e)
        if "429" in err or "quota" in err.lower():
            raise HTTPException(
                status_code=429,
                detail=(
                    "Gemini quota exceeded. Wait 30 seconds and retry. "
                    "Set GEMINI_MODEL=gemini-2.5-flash on Render if using gemini-2.0-flash."
                ),
            ) from e
        raise HTTPException(status_code=500, detail="Chat failed. Please try again later.") from e

    return ChatResponse(**result)
