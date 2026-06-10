import hmac

from fastapi import Depends, Header, HTTPException

from app.config import Settings, get_settings
from app.services.auth import decode_supabase_jwt
from app.services.supabase_access import assert_document_owner


def verify_api_key(
    settings: Settings,
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
) -> None:
    expected = settings.rag_api_key.strip()
    if not expected:
        if settings.require_auth:
            raise HTTPException(status_code=503, detail="API key is not configured.")
        return
    if not x_api_key or not hmac.compare_digest(x_api_key, expected):
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")


def require_gemini(settings: Settings) -> None:
    if not settings.google_api_key.strip():
        raise HTTPException(
            status_code=503,
            detail="GOOGLE_API_KEY is not configured. Copy backend/env.example to backend/.env.",
        )


def _supabase_issuer(settings: Settings) -> str | None:
    base = settings.supabase_url.strip().rstrip("/")
    return f"{base}/auth/v1" if base else None


def get_user_id_from_token(
    settings: Settings,
    authorization: str | None = Header(default=None),
) -> str | None:
    secret = settings.supabase_jwt_secret.strip()
    if not secret:
        if settings.require_auth:
            raise HTTPException(status_code=503, detail="Supabase auth is not configured.")
        return None

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Sign in required.")

    token = authorization.removeprefix("Bearer ").strip()
    return decode_supabase_jwt(token, secret, issuer=_supabase_issuer(settings))


def require_document_access(
    settings: Settings,
    document_id: str,
    user_id: str | None,
) -> None:
    has_supabase = bool(settings.supabase_url.strip()) and bool(
        settings.supabase_service_role_key.strip()
    )
    has_jwt = bool(settings.supabase_jwt_secret.strip())

    if has_supabase != has_jwt:
        raise HTTPException(
            status_code=503,
            detail="Supabase auth is misconfigured. Set URL, service role key, and JWT secret together.",
        )

    if not has_supabase:
        if settings.require_auth:
            raise HTTPException(status_code=503, detail="Document access control is not configured.")
        return

    if not user_id:
        raise HTTPException(status_code=401, detail="Sign in required for document access.")
    assert_document_owner(
        settings.supabase_url,
        settings.supabase_service_role_key,
        document_id,
        user_id,
    )


def settings_dep() -> Settings:
    return get_settings()


def user_dep(
    settings: Settings = Depends(settings_dep),
    authorization: str | None = Header(default=None),
) -> str | None:
    return get_user_id_from_token(settings, authorization)
