from fastapi import HTTPException

from app.config import Settings, get_settings


def require_openai(settings: Settings) -> None:
    if not settings.openai_api_key.strip():
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY is not configured. Copy backend/env.example to backend/.env.",
        )


def settings_dep() -> Settings:
    return get_settings()
