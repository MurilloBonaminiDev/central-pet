# Central Pet Backend

FastAPI application structured with Clean Architecture.

## Layout

```
app/
  domain/           # Entities, VOs, domain services
  application/      # Use cases, ports, DTOs
  infrastructure/   # SQLAlchemy, Redis, JWT, integrations
  api/              # HTTP adapters (v1)
  core/             # Settings
alembic/            # Migrations (no business revisions yet)
```

## Local run (without Docker)

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Alembic

```bash
alembic revision --autogenerate -m "message"   # after models exist
alembic upgrade head
```

Do not create business schemas until the modeling phase.
