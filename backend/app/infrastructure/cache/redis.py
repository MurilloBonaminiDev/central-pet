"""Redis client preparation — optional for local-dev (auth does not use it yet)."""

from collections.abc import Generator
from typing import Any

from app.core.config import settings

redis_client: Any | None = None


def _build_client() -> Any | None:
    if not settings.redis_enabled:
        return None
    import redis

    return redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)


def get_redis() -> Generator[Any | None, None, None]:
    """FastAPI dependency that yields Redis when configured, otherwise None."""
    global redis_client
    if redis_client is None and settings.redis_enabled:
        redis_client = _build_client()
    yield redis_client
