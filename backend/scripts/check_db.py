from sqlalchemy import text

from app.infrastructure.database.session import DATABASE_URL, SessionLocal

print("dialect", DATABASE_URL.split("://", 1)[0])
print("ssl", "sslmode=require" in DATABASE_URL)

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
    print("ERR", type(exc).__name__, str(exc)[:300])
finally:
    db.close()
