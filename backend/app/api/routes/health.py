from fastapi import APIRouter, Depends

from app.api.deps import require_gemini, settings_dep
from app.config import Settings
from app.services.vector_store import get_vector_store

router = APIRouter()


@router.get("/health")
def health(settings: Settings = Depends(settings_dep)) -> dict:
    gemini_ok = bool(settings.google_api_key.strip())
    chroma_ok = False
    chroma_chunks = 0

    try:
        store = get_vector_store(settings)
        chroma_ok = store._collection is not None
        if chroma_ok:
            chroma_chunks = store._collection.count()
    except Exception:
        chroma_ok = False

    auth_mode = "open"
    if settings.rag_api_key.strip():
        auth_mode = "api_key"
    if settings.supabase_jwt_secret.strip() and settings.supabase_service_role_key.strip():
        auth_mode = "supabase_jwt"

    status = "ok" if gemini_ok and chroma_ok else "degraded"

    return {
        "status": status,
        "service": "documind-api",
        "gemini_configured": gemini_ok,
        "gemini_model": settings.gemini_model,
        "chroma_directory": settings.chroma_persist_directory,
        "chroma_ready": chroma_ok,
        "chroma_chunk_count": chroma_chunks,
        "auth_mode": auth_mode,
        "supabase_auth_enabled": bool(settings.supabase_jwt_secret.strip()),
    }


@router.get("/health/ready")
def readiness(settings: Settings = Depends(settings_dep)) -> dict:
    """Stricter check used before serving traffic — verifies Gemini is configured."""
    require_gemini(settings)
    store = get_vector_store(settings)
    _ = store._collection.count()
    return {"status": "ready"}
