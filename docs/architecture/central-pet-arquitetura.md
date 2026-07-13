# Central Pet — Documento Técnico de Arquitetura

**Versão:** 1.0  
**Status:** Planejamento (pré-implementação)  
**Tipo:** SaaS multi-tenant para Clínicas Veterinárias e Pet Shops  
**Escopo deste documento:** arquitetura, organização e estratégias — sem funcionalidades, telas, APIs ou schema de banco.

---

## 1. Visão Geral da Arquitetura

### 1.1 Princípios

| Princípio | Decisão |
|-----------|---------|
| Separação de responsabilidades | Clean Architecture + Domain-Driven Design (DDD light) |
| Multi-tenant first | Isolamento por `tenant_id` em todas as camadas |
| Frontend desacoplado | SPA (ou SSR seletivo) consumindo API/BaaS via adaptadores |
| Backend como núcleo de regras | Domínio puro, sem dependência de framework |
| Banco como fonte de verdade | PostgreSQL com RLS e migrations versionadas |
| Escalabilidade horizontal | Stateless services + storage gerenciado |
| Integrações plugáveis | Ports & Adapters (Hexagonal) |

### 1.2 Estilo Arquitetural

**Arquitetura Hexagonal (Ports & Adapters) + Clean Architecture**, organizada em monorepo modular.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTES (Web / PWA)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / Realtime
┌────────────────────────────▼────────────────────────────────────┐
│                    EDGE / CDN / API GATEWAY                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  APPLICATION LAYER (Use Cases / Orchestration / Auth Context)   │
└──────────────┬─────────────────────────────┬────────────────────┘
               │                             │
┌──────────────▼──────────────┐ ┌────────────▼────────────────────┐
│     DOMAIN LAYER            │ │     INFRASTRUCTURE LAYER        │
│  Entities · VOs · Policies  │ │  DB · Storage · Queue · Email   │
│  Domain Services            │ │  Payment · WhatsApp · NFe       │
└─────────────────────────────┘ └─────────────────────────────────┘
```

### 1.3 Stack de Referência (recomendação técnica)

| Camada | Tecnologia recomendada | Justificativa |
|--------|------------------------|---------------|
| Frontend | React + TypeScript + Vite | Ecossistema maduro, tipagem, DX |
| Estilo | Tailwind CSS + design tokens | Consistência e velocidade de UI |
| Estado servidor | TanStack Query | Cache, invalidação, offline-friendly |
| Estado UI | Context / Zustand (local) | Sem over-engineering |
| Backend / BaaS | Supabase (Auth, Postgres, RLS, Storage, Edge Functions) | Multi-tenant com RLS nativo; time lean |
| Edge / Jobs | Supabase Edge Functions + filas (quando necessário) | Lógica sensível e webhooks |
| Hosting Frontend | Vercel / Cloudflare Pages | CDN global, preview deploys |
| Observabilidade | Logs estruturados + error tracking (Sentry) | Operação SaaS |

> A stack é uma **decisão de arquitetura**, não implementação. Pode ser revisada antes do kickoff de código.

### 1.4 Topologia do Sistema

```
central-pet/
├── apps/
│   ├── web/                 # Aplicação principal (tenant)
│   ├── admin/               # Painel plataforma (super-admin)
│   └── landing/             # Site institucional / marketing (opcional)
├── packages/
│   ├── domain/              # Entidades, VOs, regras puras
│   ├── application/         # Casos de uso / ports
│   ├── infrastructure/      # Adaptadores (Supabase, HTTP, etc.)
│   ├── ui/                  # Design system / componentes reutilizáveis
│   ├── shared/              # Tipos, constants, utils cross-cutting
│   └── config/              # ESLint, TSConfig, Tailwind presets
├── supabase/                # Migrations, policies, functions, seeds
└── docs/                    # Arquitetura, ADRs, runbooks
```

---

## 2. Estrutura de Pastas (Monorepo)

### 2.1 Árvore completa (nível arquitetural)

```
central-pet/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/                 # Bootstrap, router, providers
│   │   │   ├── modules/             # Features por domínio de negócio
│   │   │   ├── shared/              # Hooks/utils só do app web
│   │   │   └── styles/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── admin/
│   │   └── src/                     # Mesma organização, escopo plataforma
│   └── landing/
│       └── src/
├── packages/
│   ├── domain/
│   │   └── src/
│   │       ├── tenant/
│   │       ├── identity/
│   │       ├── catalog/             # (organização por bounded context)
│   │       ├── clinical/
│   │       ├── commerce/
│   │       └── shared/              # Erros de domínio, base types
│   ├── application/
│   │   └── src/
│   │       ├── ports/               # Interfaces (repositórios, gateways)
│   │       └── use-cases/           # Orquestração por contexto
│   ├── infrastructure/
│   │   └── src/
│   │       ├── supabase/
│   │       ├── http/
│   │       ├── storage/
│   │       ├── messaging/
│   │       └── integrations/
│   ├── ui/
│   │   └── src/
│   │       ├── primitives/          # Button, Input, Modal...
│   │       ├── patterns/            # FormField, DataTable shell...
│   │       ├── layouts/
│   │       └── tokens/
│   ├── shared/
│   │   └── src/
│   │       ├── types/
│   │       ├── constants/
│   │       ├── utils/
│   │       └── i18n/
│   └── config/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   ├── policies/                    # Documentação / snippets de RLS
│   └── seed/
├── docs/
│   ├── architecture/
│   ├── adr/                         # Architecture Decision Records
│   └── runbooks/
├── package.json                     # Workspace root
├── pnpm-workspace.yaml              # (ou npm/yarn workspaces)
└── README.md
```

### 2.2 Organização por módulo (Feature-Sliced dentro de `apps/web`)

Cada módulo de negócio no frontend espelha um bounded context:

```
apps/web/src/modules/<contexto>/
├── pages/           # Composição de telas (sem regra de negócio)
├── components/      # UI específica do módulo
├── hooks/           # Hooks de apresentação / query wrappers
├── api/             # Adaptadores de chamada (thin)
└── index.ts         # API pública do módulo
```

**Regra:** módulos não importam internals de outros módulos — apenas via `index.ts` ou packages compartilhados.

---

## 3. Organização Frontend

### 3.1 Camadas no cliente

```
UI (pages/components)
        ↓
Presentation hooks (queries, forms, UI state)
        ↓
Application adapters (chama use-cases ou services tipados)
        ↓
Infrastructure client (Supabase SDK / HTTP)
```

### 3.2 Responsabilidades

| Camada | Pode | Não pode |
|--------|------|----------|
| Pages | Compor layouts, rotas, loading/error | Conter regra de negócio |
| Module components | UX do domínio | Acessar SDK direto (preferir hooks) |
| Hooks | Orquestrar dados + estado de tela | Duplicar invariantes de domínio |
| Packages/ui | Visual e acessibilidade | Conhecer tenant/negócio |
| Packages/domain | Regras puras | Importar React/Supabase |

### 3.3 Roteamento e shells

- **App Shell:** layout autenticado (sidebar/nav, tenant switcher se aplicável, user menu).
- **Auth Shell:** login, recuperação, convite.
- **Public Shell:** landing / páginas públicas.
- **Guards:** autenticação, membership do tenant, roles, status da assinatura.

### 3.4 Estado

| Tipo de estado | Estratégia |
|----------------|------------|
| Dados remotos | Server state (TanStack Query) |
| Sessão / tenant atual | Auth + Tenant context |
| Formulários longos | Estado local / form library |
| Preferências UI | Local storage isolado por usuário |
| Realtime | Subscriptions com invalidação de cache |

### 3.5 Apps separados

| App | Público | Papel |
|-----|---------|-------|
| `web` | Tenants (clínicas / pet shops) | Operação do negócio |
| `admin` | Equipe Central Pet | Gestão da plataforma, tenants, billing |
| `landing` | Mercado | Aquisição, pricing, conteúdo |

Isolamento evita vazamento de capabilities de plataforma no app do cliente.

---

## 4. Organização Backend

### 4.1 Modelo operacional

Backend **híbrido**:

1. **Postgres + RLS** como enforcement de multi-tenant e autorização de dados.
2. **Edge Functions** para casos que exigem privilégio elevado, orquestração, webhooks ou segredos.
3. **Application layer** (packages) compartilhada entre client-safe orchestration e functions.

### 4.2 Ports (contratos)

Exemplos de ports (interfaces), sem implementação:

- `TenantRepository`
- `IdentityGateway`
- `UnitOfWork` / `Transaction`
- `FileStorage`
- `EventBus`
- `PaymentGateway`
- `NotificationGateway`
- `ExternalIntegrationGateway`

### 4.3 Use Cases

- Um use case = uma intenção de negócio.
- Entrada/saída tipadas (DTOs de aplicação, não de UI).
- Sempre recebem **TenantContext** + **ActorContext**.
- Idempotência onde houver efeitos externos (pagamentos, webhooks).

### 4.4 Edge Functions — critérios de uso

Usar Edge Function quando:

- Precisa de service role / bypass controlado de RLS
- Processa webhook de terceiro
- Executa job assíncrono / fan-out
- Centraliza segredo (API keys)
- Precisa de validação server-side crítica

Não usar Edge Function para CRUD trivial já coberto por RLS + políticas.

### 4.5 Segurança backend

- Auth JWT com claims de tenant/role (ou lookup de membership)
- RLS obrigatório em tabelas tenant-scoped
- Service role apenas em functions auditáveis
- Validação de input na borda (schema validation)
- Rate limiting na edge / gateway
- Auditoria de ações sensíveis (quem, quando, tenant, recurso)

---

## 5. Organização do Banco

### 5.1 Estratégia geral

- **PostgreSQL** único (inicial), schema logicamente particionado por contexto.
- **Row Level Security (RLS)** como barreira principal de isolamento.
- **Migrations** versionadas e imutáveis após merge.
- **Sem schema físico por tenant** no estágio inicial (ver seção Multi-Tenant).

### 5.2 Organização lógica

```
supabase/migrations/
├── 0001_extensions.sql
├── 0002_shared_types.sql
├── 0003_identity_tenant.sql
├── 0004_<contexto>_....sql
└── ...
```

Agrupamento por **bounded context**, não por tela.

### 5.3 Convenções de modelagem (arquiteturais)

| Elemento | Convenção |
|----------|-----------|
| PK | `uuid` (gen_random_uuid) |
| Tenant FK | `tenant_id uuid not null` em tabelas tenant-scoped |
| Timestamps | `created_at`, `updated_at` (timestamptz) |
| Soft delete | `deleted_at` quando houver requisito de retenção |
| Auditoria | tabelas `*_audit` ou event log central |
| Enums | tipos Postgres ou check constraints documentados |
| Naming | `snake_case`, plural para tabelas (`patients`, `appointments`) |

### 5.4 Espaços de dados

| Espaço | Conteúdo | Isolamento |
|--------|----------|------------|
| Platform | Tenants, planos, billing plataforma, admins | Role plataforma |
| Tenant operational | Dados do dia a dia do cliente | RLS por `tenant_id` |
| Shared reference | Catálogos globais read-only (se houver) | Público autenticado / cache |
| Files | Storage buckets com path `tenant_id/...` | Policies de storage |

### 5.5 Índices e performance (estratégia)

- Índice composto liderado por `tenant_id` em queries tenant-scoped.
- Evitar sequential scans cross-tenant.
- Particionamento futuro por data em tabelas de alto volume (eventos, logs).
- Read replicas quando métricas justificarem.

### 5.6 O que este documento NÃO define

- Tabelas concretas de domínio
- Policies SQL detalhadas
- Seeds de negócio

Isso fica para a fase de modelagem de dados.

---

## 6. Convenções de Nomenclatura

### 6.1 Geral

| Escopo | Convenção |
|--------|-----------|
| Arquivos/pastas TS/TSX | `kebab-case` |
| Componentes React | `PascalCase` |
| Funções / variáveis | `camelCase` |
| Tipos / Interfaces | `PascalCase` |
| Constantes | `SCREAMING_SNAKE_CASE` |
| SQL | `snake_case` |
| Env vars | `SCREAMING_SNAKE_CASE` com prefixo `CENTRAL_PET_` ou `VITE_` |

### 6.2 Domínio e aplicação

| Tipo | Padrão | Exemplo de forma |
|------|--------|------------------|
| Entity | Substantivo | `Patient`, `Appointment` |
| Value Object | Substantivo descritivo | `Money`, `DocumentId` |
| Use Case | Verbo + substantivo | `ScheduleAppointment`, `RegisterSale` |
| Port | `I` opcional ou sufixo `Repository`/`Gateway` | `PatientRepository` |
| DTO | Sufixo claro | `CreatePatientInput` |
| Erro de domínio | Sufixo `Error` | `TenantInactiveError` |

### 6.3 Frontend

| Tipo | Padrão |
|------|--------|
| Page | `*Page.tsx` |
| Layout | `*Layout.tsx` |
| Hook | `use*.ts` |
| Context Provider | `*Provider.tsx` |
| Módulo export | `modules/<name>/index.ts` |

### 6.4 Banco

| Tipo | Padrão |
|------|--------|
| Tabela | plural `snake_case` |
| Coluna | `snake_case` |
| FK | `<entity>_id` |
| Index | `idx_<table>_<cols>` |
| Unique | `uq_<table>_<cols>` |
| Policy | `pol_<table>_<action>_<scope>` |
| Function SQL | `fn_<verb>_<object>` |

### 6.5 Branches e commits

- Branches: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`
- Commits: imperativo, foco no *porquê* (ex.: “isolate tenant context in application layer”)

### 6.6 Idioma

- **Código e identifiers:** inglês.
- **Documentação de produto / UX copy:** português (pt-BR).
- **ADRs técnicos:** português ou inglês — manter consistente no repositório (recomendado: português).

---

## 7. Estratégia Multiempresa (Multi-Tenant)

### 7.1 Modelo escolhido

**Shared Database + Shared Schema + `tenant_id` + RLS**

```
┌──────────────────────────┐
│        PLATFORM          │
│  tenants · plans · admins│
└────────────┬─────────────┘
             │ 1:N
┌────────────▼─────────────┐
│   TENANT (Organization)  │
│  members · roles · status│
└────────────┬─────────────┘
             │ 1:N (todas as tabelas operacionais)
┌────────────▼─────────────┐
│     OPERATIONAL DATA     │
│   sempre com tenant_id   │
└──────────────────────────┘
```

### 7.2 Conceitos

| Conceito | Definição |
|----------|-----------|
| Tenant | Organização cliente (clínica ou pet shop) |
| Membership | Vínculo usuário ↔ tenant com role |
| Actor | Usuário autenticado executando ação |
| TenantContext | `{ tenantId, status, plan, timezone, ... }` |
| Platform Admin | Usuário fora do tenant, acesso ao app `admin` |

### 7.3 Isolamento em camadas

1. **Banco:** RLS exige `tenant_id` = tenant da sessão/membership.
2. **Application:** todo use case valida TenantContext antes de mutar.
3. **Storage:** paths prefixados por `tenant_id`.
4. **Frontend:** tenant ativo no context; queries sempre escopadas.
5. **Logs/métricas:** tag `tenant_id` obrigatória.
6. **Cache keys:** incluem `tenant_id`.

### 7.4 Resolução do tenant

Ordem recomendada:

1. Membership do usuário autenticado (header/claim/session).
2. Se multi-membership: tenant selecionado na sessão.
3. Subdomínio futuro (`clinic.centralpet.app`) como resolução opcional — não obrigatório no MVP arquitetural.
4. Platform admin opera via app separado, sem impersonation acidental.

### 7.5 Roles (modelo de autorização)

Dois eixos:

- **Platform roles:** `platform_owner`, `platform_support`
- **Tenant roles:** ex. `owner`, `admin`, `staff`, `readonly` (nomes finais na fase de produto)

Autorização = **RBAC** (role → permissions), com possibilidade futura de ABAC em recursos sensíveis.

### 7.6 Status do tenant

Estados arquiteturais (não produto):

- `provisioning`
- `active`
- `suspended`
- `cancelled`

Guards de aplicação bloqueiam mutações em estados não ativos.

### 7.7 Evolução futura do isolamento

| Estágio | Quando considerar |
|---------|-------------------|
| Shared schema + RLS (atual) | Default |
| Schema por tenant | Compliance extremo / noisy neighbor |
| Database por tenant | Enterprise contracts |
| Pooling / routing | Após métricas de carga |

A arquitetura deve permitir extrair um tenant sem reescrever o domínio (ports estáveis).

---

## 8. Camadas da Aplicação (Clean Architecture)

### 8.1 Diagrama de dependências

```
UI / Controllers / Edge Handlers
            │
            ▼
     Application (Use Cases)
            │
            ▼
         Domain
            ▲
            │
   Infrastructure (implementa ports)
```

**Regra de ouro:** dependências apontam **para dentro**. Domain não conhece frameworks.

### 8.2 Domain Layer

Responsabilidades:

- Entidades e agregados
- Value Objects
- Invariantes e políticas de domínio
- Domain Events (conceitual)
- Erros de domínio

Proibido:

- Importar React, Supabase, HTTP, UI
- Conhecer detalhes de persistência

### 8.3 Application Layer

Responsabilidades:

- Casos de uso
- Orquestração de repositórios/gateways
- Transações (via Unit of Work port)
- Mapeamento Input → Domain → Output
- Autorização de intenção (além do RLS)

### 8.4 Infrastructure Layer

Responsabilidades:

- Repositórios Postgres/Supabase
- Auth adapters
- Storage
- Filas / cron
- Clientes de integração externa
- Mappers persistence ↔ domain

### 8.5 Interface / Presentation Layer

- React pages/components
- Edge Function HTTP handlers
- CLI/admin tools (se houver)

Apenas traduz request/response ↔ application DTOs.

### 8.6 Cross-cutting

Tratados como infrastructure/shared policies:

- Logging
- Tracing
- Feature flags
- Validation schemas
- Clock / UUID generators (injetáveis para teste)

### 8.7 Testabilidade

| Camada | Tipo de teste |
|--------|---------------|
| Domain | Unit puro |
| Application | Unit com ports fake |
| Infrastructure | Integration (DB test / contract) |
| UI | Component + e2e críticos |

---

## 9. Organização de Componentes Reutilizáveis

### 9.1 Pirâmide de UI

```
tokens → primitives → patterns → module components → pages
```

| Nível | Pacote / local | Conhece negócio? |
|-------|----------------|------------------|
| Tokens | `packages/ui/tokens` | Não |
| Primitives | `packages/ui/primitives` | Não |
| Patterns | `packages/ui/patterns` | Não (genéricos) |
| Module components | `apps/*/modules/*/components` | Sim |
| Pages | `apps/*/modules/*/pages` | Sim (composição) |

### 9.2 Regras de reuso

1. Se é visual puro e aparece em 2+ módulos → sobe para `packages/ui`.
2. Se contém regra de um domínio → permanece no módulo.
3. Se é lógica de dados cross-module → `packages/application` ou hook compartilhado cuidadoso.
4. Evitar “God components” e props dumping.
5. Acessibilidade (a11y) é requisito dos primitives.

### 9.3 Design System (arquitetural)

- Tokens: cor, tipografia, spacing, radius, elevation, motion.
- Temas: suporte a white-label futuro por tenant (tokens runtime), sem acoplar no MVP.
- Documentação de componentes via Storybook (recomendado na fase de UI).

### 9.4 Formulários e tabelas

- Patterns genéricos (`FormField`, `FilterBar`, `Pagination`) no UI kit.
- Colunas, validações e actions específicas ficam nos módulos.

---

## 10. Estratégia para Escalabilidade

### 10.1 Eixos de escala

| Eixo | Abordagem |
|------|-----------|
| Usuários concorrentes | App stateless + CDN + connection pooling |
| Dados por tenant | Índices tenant-first; arquivar dados frios |
| Tenants (quantidade) | Shared schema; monitoramento de noisy neighbors |
| Throughput de escrita | Filas para trabalho assíncrono; idempotency keys |
| Leitura | Cache de queries; realtime seletivo; replicas futuras |
| Arquivos | Object storage; CDN; lifecycle policies |
| Deploy | Preview environments; migrations forward-only |

### 10.2 Performance budget (diretrizes)

- Frontend code-splitting por rota/módulo.
- Lazy load de módulos pesados.
- Evitar over-fetch; contratos de leitura explícitos (projections).
- Realtime apenas onde UX exigir.

### 10.3 Confiabilidade

- Healthchecks
- Timeouts e retries com backoff em integrações
- Circuit breaker em gateways externos
- Backups automatizados do Postgres
- Disaster recovery documentado em runbook

### 10.4 Observabilidade

Todo evento operacional deve carregar:

- `request_id`
- `tenant_id` (quando aplicável)
- `actor_id`
- `module`

Métricas-alvo: latência p95, error rate, saturação de DB, fila lag.

### 10.5 Crescimento organizacional do código

- Bounded contexts claros evitam monólito engessado.
- Extrair microserviços **somente** com evidência (domínio estável + necessidade de escala/time independente).
- Preferir modular monorepo até doer.

---

## 11. Estratégia para Futuras Integrações

### 11.1 Padrão Ports & Adapters

Toda integração externa entra como **Gateway** atrás de uma interface estável.

```
Use Case → NotificationGateway (port)
                │
                ├── WhatsAppAdapter
                ├── EmailAdapter
                └── SmsAdapter
```

Trocar provedor = novo adapter, sem alterar domínio.

### 11.2 Categorias de integração previstas (capacidade arquitetural)

| Categoria | Exemplos de capacidade | Padrão |
|-----------|------------------------|--------|
| Comunicação | WhatsApp, e-mail, SMS | Gateway + templates |
| **Agenda inbound** | WhatsApp → agendamento `PENDENTE` | Port + webhook + `create_from_channel` |
| Pagamentos | PSP / PIX / cartão | Gateway + webhooks idempotentes |
| Fiscal | NFe / NFS-e | Gateway + fila + retry |
| Agenda / canais | Google Calendar, etc. | Sync jobs + conflict policy |
| Contábil/ERP | Exportações | Anti-corruption layer |
| Identidade | SSO enterprise | Auth provider adapter |
| Analytics | BI / warehouse | Event outbox → ETL |

> Preparação WhatsApp inbound: ver `docs/architecture/whatsapp-inbound-booking.md`.
> Endpoints stub: `GET/POST /api/v1/webhooks/whatsapp` (501 enquanto `WHATSAPP_WEBHOOKS_ENABLED=false`).

### 11.3 Event-Driven readiness

Introduzir **Outbox Pattern** quando houver necessidade de:

- Fan-out confiável
- Integrações assíncronas
- Desacoplamento entre contextos

Fluxo:

1. Use case persiste estado + outbox event (mesma transação).
2. Publisher entrega ao bus.
3. Consumers/adapters processam com idempotência.

### 11.4 Webhooks

- Endpoint versionado
- Assinatura/HMAC validada
- Deduplicação por `event_id`
- Processamento assíncrono
- Dead letter queue para falhas

### 11.5 Versionamento de contratos

- APIs internas/externas versionadas (`v1`)
- Adapters isolam breaking changes de terceiros
- Feature flags para rollout gradual de integrações por tenant/plano

### 11.6 Anti-Corruption Layer (ACL)

Integrações com sistemas legados ou ERPs nunca vazam tipos externos para o Domain. O ACL traduz modelos externos ↔ modelos internos.

---

## 12. Segurança e Compliance (base arquitetural)

| Tema | Diretriz |
|------|----------|
| Dados clínicos / LGPD | Minimização, retenção, base legal, DPA com tenants |
| Segredos | Vault/env gerenciado; nunca no frontend |
| Acesso | Least privilege; RLS; RBAC |
| Auditoria | Trilha em ações sensíveis |
| Backup | Criptografado; testes de restore |
| Ambientes | Separação dev / staging / prod |

---

## 13. Ambientes e Entrega

```
Local → Preview (PR) → Staging → Production
```

| Prática | Decisão |
|---------|---------|
| CI | Lint, typecheck, unit tests, migration dry-run |
| CD | Deploy frontend + functions; migrations controladas |
| Feature flags | Liberação progressiva por tenant |
| ADR | Toda decisão estrutural relevante registrada em `docs/adr` |

---

## 14. ADRs Iniciais (a formalizar)

1. Monorepo modular com packages de Clean Architecture  
2. Multi-tenant shared schema + RLS  
3. Supabase como plataforma de dados/auth inicial  
4. Apps separados: `web`, `admin`, (opcional) `landing`  
5. Integrações via Ports & Adapters + Outbox quando necessário  

---

## 15. Fora de Escopo Deste Documento

Explicitamente **não** incluído:

- Lista de funcionalidades do produto
- Wireframes / telas
- Contratos de API
- Schema SQL de negócio
- Estimativas de sprint
- Copy de marketing

Próximos documentos sugeridos (sob comando):

1. Bounded contexts e mapa de domínio  
2. Modelagem de dados (ER lógico)  
3. Matriz de permissões  
4. ADR detalhados por decisão  
5. Plano de implementação por fases

---

## 16. Resumo Executivo

O Central Pet será um **SaaS multi-tenant** em **monorepo**, com **Clean/Hexagonal Architecture**, isolamento por **`tenant_id` + RLS**, frontend em apps separados (`web` / `admin`), domínio puro em packages, e integrações futuras atrás de **ports** com prontidão a **eventos (outbox)**. Escalabilidade começa vertical/modular e evolui por métricas, sem microserviços prematuros.

---

**Fim do documento de arquitetura v1.0**  
Aguardando próximo comando para avançar.
