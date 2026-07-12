# Dashboard

Módulo visual premium da clínica (`apps/web/src/modules/dashboard`).

## Inclui

- Layout com Sidebar + Navbar
- Hero de boas-vindas
- Cards KPI: Consultas, Banhos, Vacinas, Receita do Dia, Receita Mensal, Clientes, Pets
- Gráfico financeiro (área SVG)
- Gráfico de consultas (barras animadas)
- Agenda do dia
- Últimos atendimentos
- Atalhos rápidos
- Calendário lateral

## Dados

Mock local em `data/mock.ts` (sem APIs de outros módulos).

## Rota

`/dashboard` (protegida por autenticação)
