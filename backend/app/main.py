from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.config import Settings, get_settings
from app.limiter import limiter


def validate_auth_config(settings: Settings) -> None:
    has_jwt = bool(settings.supabase_jwt_secret.strip())
    has_sb = bool(settings.supabase_url.strip()) and bool(
        settings.supabase_service_role_key.strip()
    )
    has_api_key = bool(settings.rag_api_key.strip())

    if has_jwt != has_sb:
        raise RuntimeError(
            "SUPABASE_JWT_SECRET, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY must all be set together."
        )

    if settings.require_auth and not has_api_key and not has_jwt:
        raise RuntimeError(
            "Set RAG_API_KEY or full Supabase auth before serving production traffic."
        )


def create_app() -> FastAPI:
    settings = get_settings()
    validate_auth_config(settings)

    app = FastAPI(
        title="DocuMind API",
        description="FastAPI + LangChain + ChromaDB + Gemini RAG backend (Blueprint Step 4)",
        version="0.1.0",
        docs_url=None if settings.require_auth else "/docs",
        redoc_url=None if settings.require_auth else "/redoc",
    )
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-API-Key"],
    )

    app.include_router(api_router, prefix="/api/v1")

    @app.get("/")
    def root() -> dict:
        return {"service": "documind-api", "health": "/api/v1/health"}

    return app


app = create_app()
