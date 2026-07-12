# ADR 0001 — Backend stack for physical scaffold

## Status

Accepted

## Context

The architecture document recommended Supabase as a possible BaaS. The kickoff command for the physical scaffold required FastAPI, SQLAlchemy, Alembic, JWT, Redis, and Docker.

## Decision

Use a polyglot monorepo:

- Frontend: React/Vite packages as documented
- Backend: FastAPI with Clean Architecture layers inside `backend/app`
- Persistence/cache: PostgreSQL + Redis via Docker Compose
- Auth primitives: JWT helpers prepared (no auth flows yet)

## Consequences

- Domain rules for the API live in Python (`backend/app/domain`)
- TypeScript `packages/domain` remains available for shared client-side contracts
- Supabase is not part of the initial scaffold
