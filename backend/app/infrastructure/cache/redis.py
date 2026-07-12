"""Redis client preparation — connection ready, no business caching yet."""

from collections.abc import Generator

import redis

from app.core.config import settings

redis_client = redis.Redis.from_url(
    settings.REDIS_URL,
    decode_responses=True,
)


def get_redis() -> Generator[redis.Redis, None, None]:
    """FastAPI dependency that yields the Redis client."""
    yield redis_client
