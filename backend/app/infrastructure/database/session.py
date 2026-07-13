"""Database engine and session factory — structure only, no schema creation."""

from collections.abc import Generator
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


def normalize_database_url(url: str) -> str:
    """Ensure Postgres URLs work with psycopg3 + Supabase SSL."""
    raw = (url or "").strip()
    if not raw:
        return raw

    if raw.startswith("postgres://"):
        raw = "postgresql://" + raw[len("postgres://") :]

    if raw.startswith("postgresql://") and not raw.startswith("postgresql+"):
        raw = "postgresql+psycopg://" + raw[len("postgresql://") :]

    if "supabase." in raw and "sslmode=" not in raw:
        parsed = urlparse(raw)
        query = dict(parse_qsl(parsed.query, keep_blank_values=True))
        query["sslmode"] = "require"
        raw = urlunparse(parsed._replace(query=urlencode(query)))

    return raw


DATABASE_URL = normalize_database_url(settings.DATABASE_URL)

_engine_kwargs: dict = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    # SQLite needs this for FastAPI's multi-threaded request handling.
    _engine_kwargs = {"connect_args": {"check_same_thread": False}}

engine = create_engine(DATABASE_URL, **_engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
