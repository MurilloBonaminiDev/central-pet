import { useState } from 'react';
import { Button } from '@central-pet/ui';
import { KpiCard } from '@modules/dashboard/components/KpiCard';
import { CashflowChart } from '@modules/finance/components/CashflowChart';
import { CategoryBreakdownChart } from '@modules/finance/components/CategoryBreakdownChart';
import { FinanceMovementsTable } from '@modules/finance/components/FinanceMovementsTable';
import { FinanceTransactionForm } from '@modules/finance/components/FinanceTransactionForm';
import { financeApi, formatBRLFromCents } from '@modules/finance/api';
import { useFinanceSummary } from '@modules/finance/hooks/useFinanceSummary';

function IconCash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function IconOut() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconProfit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 16l5-5 4 4 7-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMonth() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function AdminFinancePage() {
  const { summary, loading, error, refetch } = useFinanceSummary();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setActionError(null);
    setBusyId(id);
    try {
      await financeApi.deleteTransaction(id);
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível excluir');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
          />
        ))}
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-12 text-center">
        <p className="font-display text-xl font-semibold text-[var(--color-fg)]">
          Não foi possível carregar o financeiro
        </p>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{error}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-5 text-sm font-semibold text-[var(--color-primary-fg)] hover:bg-[var(--color-brand-700)]"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { kpis } = summary;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
            Gestão
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)]">
            Financeiro
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            Controle de entradas (consultas, banhos, tosas, cirurgias, produtos) e saídas (compras,
            despesas, custos).
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => void refetch()}>
          Atualizar
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Receita total"
          value={formatBRLFromCents(kpis.total_revenue_cents)}
          hint="Todas as entradas"
          accent="success"
          icon={<IconCash />}
          delayMs={40}
        />
        <KpiCard
          label="Despesas"
          value={formatBRLFromCents(kpis.total_expenses_cents)}
          hint="Todas as saídas"
          accent="warning"
          icon={<IconOut />}
          delayMs={80}
        />
        <KpiCard
          label="Lucro"
          value={formatBRLFromCents(kpis.profit_cents)}
          hint="Receita − despesas"
          accent={kpis.profit_cents >= 0 ? 'brand' : 'warning'}
          icon={<IconProfit />}
          delayMs={120}
        />
        <KpiCard
          label="Lucro do mês"
          value={formatBRLFromCents(kpis.monthly_profit_cents)}
          hint={`Receita ${formatBRLFromCents(kpis.monthly_revenue_cents)}`}
          accent="accent"
          icon={<IconMonth />}
          delayMs={160}
        />
      </div>

      <CashflowChart
        title="Fluxo financeiro"
        subtitle="Receitas e despesas nos últimos 12 meses"
        revenue={summary.revenue_by_month}
        expenses={summary.expenses_by_month}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <CategoryBreakdownChart
          title="Entradas por categoria"
          subtitle="Mês atual — consultas, banhos, tosas, cirurgias e produtos"
          data={summary.income_by_category}
          tone="income"
        />
        <CategoryBreakdownChart
          title="Saídas por categoria"
          subtitle="Mês atual — compras, despesas e custos"
          data={summary.expenses_by_category}
          tone="expense"
        />
      </div>

      <FinanceTransactionForm onCreated={() => void refetch()} />

      <section className="space-y-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-fg)]">
            Movimentações
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)]">
            Últimos lançamentos registrados. Serviços finalizados entram automaticamente.
          </p>
        </div>
        {actionError ? (
          <p
            className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {actionError}
          </p>
        ) : null}
        <FinanceMovementsTable
          items={summary.recent_movements}
          busyId={busyId}
          onDelete={(id) => void handleDelete(id)}
        />
      </section>
    </div>
  );
}
