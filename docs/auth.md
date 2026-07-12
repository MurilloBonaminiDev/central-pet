# Central Pet — Authentication

## Backend endpoints

| Method | Path | Descrição |
|--------|------|-----------|
| POST | `/api/v1/auth/login` | Login (com seleção de empresa se multi-tenant) |
| POST | `/api/v1/auth/refresh` | Renova access/refresh tokens |
| POST | `/api/v1/auth/logout` | Revoga refresh token / sessão |
| POST | `/api/v1/auth/forgot-password` | Solicita redefinição |
| POST | `/api/v1/auth/reset-password` | Redefine senha com token |
| GET | `/api/v1/auth/me` | Sessão atual (JWT + tenant) |
| GET | `/api/v1/auth/roles` | Lista perfis |

## Roles (por empresa)

- `administrator` — Administrador
- `veterinarian` — Veterinário
- `reception` — Recepção
- `financial` — Financeiro
- `grooming` — Banho e Tosa

## Middleware / guards

- `TenantContextMiddleware` — propaga `X-Tenant-Id`
- `get_current_principal` — JWT Bearer
- `require_tenant_header` — empresa da sessão
- `require_roles(...)` — RBAC por perfil

## Setup local

### Sem Docker (recomendado no Windows sem virtualização)

Usa SQLite + Redis desligado (`REDIS_URL=memory://`).

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m scripts.seed_auth
uvicorn app.main:app --reload --port 8000
```

Garanta no `.env` na raiz:

```env
DATABASE_URL=sqlite:///./central_pet.db
REDIS_URL=memory://
```

### Com Docker (Postgres + Redis)

```bash
# Postgres + Redis
docker compose up -d postgres redis

cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
alembic upgrade head
python -m scripts.seed_auth
uvicorn app.main:app --reload --port 8000
```

Demo users (senha `Senha@123`):

- admin@centralpet.local
- vet@centralpet.local
- recepcao@centralpet.local
- financeiro@centralpet.local
- tosa@centralpet.local

## Frontend

Rotas: `/login`, `/esqueci-senha`, `/redefinir-senha`, `/sessao`  
Guards: `GuestRoute`, `ProtectedRoute` (+ roles)
