from sqlalchemy import text

from app.core.config import settings
from app.infrastructure.database.session import DATABASE_URL, SessionLocal, normalize_database_url

raw = settings.DATABASE_URL
normalized = normalize_database_url(raw)
print("raw_starts", raw[:40].replace("\n", " "))
print("dialect", normalized.split("://", 1)[0])
print("is_sqlite", normalized.startswith("sqlite"))
print("has_placeholder", "[YOUR-PASSWORD]" in raw or "SUA_URL" in raw)
print("ssl", "sslmode=require" in normalized)

if normalized.startswith("sqlite"):
    print("ERR_HINT Use Supabase URI in backend/.env — root .env still points to SQLite.")
    raise SystemExit(1)

db = SessionLocal()
try:
    print("ping", db.execute(text("select 1")).scalar())
    tables = db.execute(
        text(
            "select count(*) from information_schema.tables "
            "where table_schema = 'public'"
        )
    ).scalar()
    print("public_tables", tables)
    try:
        print("users", db.execute(text("select count(*) from users")).scalar())
    except Exception as exc:  # noqa: BLE001
        print("users_err", type(exc).__name__, str(exc)[:200])
except Exception as exc:  # noqa: BLE001
    print("ERR", type(exc).__name__, str(exc)[:400])
finally:
    db.close()
