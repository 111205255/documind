from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment configuration — see backend/env.example."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    google_api_key: str = ""
    rag_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    gemini_embedding_model: str = "gemini-embedding-001"

    chroma_persist_directory: str = "./chroma_data"
    chroma_collection_name: str = "documind_chunks"

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = (
        "http://localhost:3000,http://localhost:8081,"
        "https://documind-beige.vercel.app,https://documind-app-two.vercel.app"
    )

    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""

    environment: str = "development"
    max_upload_bytes: int = 50 * 1024 * 1024
    max_ingest_text_chars: int = 500_000

    chunk_size: int = 1000
    chunk_overlap: int = 150
    retrieval_k: int = 6

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def require_auth(self) -> bool:
        return self.environment.strip().lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
