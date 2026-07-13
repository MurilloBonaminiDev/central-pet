"""Application settings loaded from environment variables."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parents[2]
_ROOT_DIR = _BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(
            str(_ROOT_DIR / ".env"),
            str(_BACKEND_DIR / ".env"),
            ".env",
        ),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_ENV: str = "development"
    APP_NAME: str = "Central Pet"
    APP_DEBUG: bool = True

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_PREFIX: str = "/api/v1"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

    # Local-dev default: SQLite (no Docker / Postgres required).
    DATABASE_URL: str = f"sqlite:///{(_BACKEND_DIR / 'central_pet.db').as_posix()}"

    # Auth does not require Redis yet; leave empty/memory to skip a live server.
    REDIS_URL: str = "memory://"

    JWT_SECRET_KEY: str = "change_me_to_a_long_random_secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    TENANT_HEADER: str = "X-Tenant-Id"

    # WhatsApp inbound webhooks — disabled until provider credentials are configured.
    WHATSAPP_WEBHOOKS_ENABLED: bool = False
    WHATSAPP_VERIFY_TOKEN: str = ""
    WHATSAPP_APP_SECRET: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def redis_enabled(self) -> bool:
        url = (self.REDIS_URL or "").strip().lower()
        return bool(url) and not url.startswith(("memory", "disabled", "none", "off"))


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
