from fastapi import APIRouter, Depends

from app.api.deps import settings_dep
from app.config import Settings

router = APIRouter()


@router.get("/health")
def health(settings: Settings = Depends(settings_dep)) -> dict:
    return {
        "status": "ok",
        "service": "documind-api",
        "openai_configured": bool(settings.openai_api_key.strip()),
        "chroma_directory": settings.chroma_persist_directory,
    }
