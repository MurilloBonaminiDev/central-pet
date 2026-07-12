# Central Pet

SaaS multi-tenant para clínicas veterinárias e pet shops.

Este repositório contém **apenas a estrutura profissional** do monorepo (sem funcionalidades de produto, páginas ou schema de negócio).

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + TypeScript + Vite + Tailwind |
| Backend | FastAPI + SQLAlchemy + Alembic + JWT |
| Cache | Redis (preparado) |
| Banco | PostgreSQL (serviço Docker; sem migrations de negócio) |
| Tooling | pnpm workspaces, ESLint, Prettier, Docker Compose |

## Estrutura

```
central-pet/
├── apps/
│   ├── web/                 # App do tenant
│   └── admin/               # App da plataforma
├── packages/
│   ├── domain/              # Domínio TS (scaffold)
│   ├── application/         # Application TS (scaffold)
│   ├── infrastructure/      # Adapters TS (scaffold)
│   ├── ui/                  # Design system (tokens only)
│   ├── shared/              # Utils/types compartilhados
│   └── config/              # ESLint, TSConfig, Tailwind preset
├── backend/                 # FastAPI (Clean Architecture)
│   ├── app/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/  # DB, Redis, JWT
│   │   ├── api/
│   │   └── core/
│   └── alembic/
├── docker/
├── docs/
├── docker-compose.yml
├── .env.example
└── package.json
```

## Aliases (Frontend)

| Alias | Destino |
|-------|---------|
| `@/` | `apps/*/src` |
| `@app/` | `apps/*/src/app` |
| `@modules/` | `apps/*/src/modules` |
| `@shared/` | `apps/*/src/shared` |
| `@central-pet/ui` | `packages/ui/src` |
| `@central-pet/shared` | `packages/shared/src` |
| `@central-pet/domain` | `packages/domain/src` |
| `@central-pet/application` | `packages/application/src` |
| `@central-pet/infrastructure` | `packages/infrastructure/src` |

## Design System

Pacote `@central-pet/ui` — tokens, light/dark, primitives, patterns e layouts.
Documentação: [`packages/ui/README.md`](packages/ui/README.md).

## Autenticação

Documentação: [`docs/auth.md`](docs/auth.md).

## Dashboard

Documentação: [`docs/dashboard.md`](docs/dashboard.md).

## Pré-requisitos

- Node.js 20+
- pnpm 9+
- Python 3.12+
- Docker + Docker Compose

## Setup local

```bash
# 1. Variáveis de ambiente
cp .env.example .env

# 2. Frontend (workspaces)
pnpm install

# 3. Backend
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Desenvolvimento sem Docker (apps)

```bash
# Terminal A — API
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal B — Web
pnpm dev:web

# Terminal C — Admin
pnpm dev:admin
```

### Infraestrutura com Docker

```bash
# Sobe Postgres + Redis + API + Web + Admin
docker compose up --build
```

Serviços:

- Web: http://localhost:5173
- Admin: http://localhost:5174
- API: http://localhost:8000
- API docs (dev): http://localhost:8000/docs
- Health: http://localhost:8000/api/v1/health
- Postgres: localhost:5432
- Redis: localhost:6379

## Scripts úteis

```bash
pnpm lint
pnpm format
pnpm typecheck
pnpm build
```

Backend:

```bash
cd backend
ruff check .
mypy app
pytest
alembic upgrade head   # quando houver revisions de negócio
```

## Documentação

- Arquitetura: [`docs/architecture/central-pet-arquitetura.md`](docs/architecture/central-pet-arquitetura.md)
- Backend: [`backend/README.md`](backend/README.md)

## Fora de escopo nesta fase

- Funcionalidades de produto
- Páginas / telas
- APIs de negócio
- Schema / models de domínio
- Migrations Alembic de negócio

Aguardando a próxima fase de implementação.
