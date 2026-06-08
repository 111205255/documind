from fastapi import HTTPException

from app.config import Settings, get_settings


def require_gemini(settings: Settings) -> None:
    if not settings.google_api_key.strip():
        raise HTTPException(
            status_code=503,
            detail="GOOGLE_API_KEY is not configured. Copy backend/env.example to backend/.env.",
        )


def settings_dep() -> Settings:
    return get_settings()
