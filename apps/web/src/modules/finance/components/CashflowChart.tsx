import type { FinanceChartPoint } from '@central-pet/shared';
import { formatBRL } from '../api';

type Props = {
  title: string;
  subtitle: string;
  revenue: FinanceChartPoint[];
  expenses: FinanceChartPoint[];
};

export function CashflowChart({ title, subtitle, revenue, expenses }: Props) {
  const labels = revenue.map((d) => d.label);
  const max = Math.max(
    ...revenue.map((d) => d.value),
    ...expenses.map((d) => d.value),
    1,
  );
  const hasData =
    revenue.some((d) => d.value > 0) || expenses.some((d) => d.value > 0);

  const width = 640;
  const height = 240;
  const padX = 32;
  const padY = 28;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  function toPoints(series: FinanceChartPoint[]) {
    return series.map((d, i) => {
      const x = padX + (i / Math.max(series.length - 1, 1)) * innerW;
      const y = padY + innerH - (d.value / max) * innerH;
      return { ...d, x, y };
    });
  }

  const revenuePoints = toPoints(revenue);
  const expensePoints = toPoints(expenses);
  const revenueLine = revenuePoints.map((p) => `${p.x},${p.y}`).join(' ');
  const expenseLine = expensePoints.map((p) => `${p.x},${p.y}`).join(' ');

  const revenueTotal = revenue.reduce((sum, d) => sum + d.value, 0);
  const expenseTotal = expenses.reduce((sum, d) => sum + d.value, 0);

  return (
    <section className="cp-dash-rise relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)] md:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--color-brand-500)]/10 to-transparent"
        aria-hidden
      />
      <header className="relative mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-[var(--color-fg)] md:text-2xl">
            {title}
          </h3>
          <p className="text-sm text-[var(--color-fg-muted)]">{subtitle}</p>
        </div>
        <div className="flex gap-4 text-right text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.06em] text-[var(--color-fg-subtle)]">
              Receitas
            </p>
            <p className="font-display font-semibold text-[var(--color-success-700)]">
              {formatBRL(revenueTotal)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.06em] text-[var(--color-fg-subtle)]">
              Despesas
            </p>
            <p className="font-display font-semibold text-[var(--color-warning-700)]">
              {formatBRL(expenseTotal)}
            </p>
          </div>
        </div>
      </header>

      {!hasData ? (
        <p className="relative py-16 text-center text-sm text-[var(--color-fg-muted)]">
          Ainda não há movimentações registradas neste período.
        </p>
      ) : (
        <div className="relative overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-60 w-full min-w-[30rem]" role="img">
            {[0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padY + innerH * (1 - ratio);
              return (
                <line
                  key={ratio}
                  x1={padX}
                  x2={width - padX}
                  y1={y}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeDasharray="5 7"
                />
              );
            })}
            <polyline
              points={revenueLine}
              fill="none"
              stroke="var(--color-success-600)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={expenseLine}
              fill="none"
              stroke="var(--color-warning-600)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {labels.map((label, i) => {
              const x = padX + (i / Math.max(labels.length - 1, 1)) * innerW;
              return (
                <text
                  key={label}
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fill="var(--color-fg-muted)"
                  fontSize="11"
                  fontWeight="600"
                >
                  {label}
                </text>
              );
            })}
          </svg>
          <div className="mt-2 flex flex-wrap gap-4 text-xs font-semibold text-[var(--color-fg-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success-600)]" />
              Entradas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-warning-600)]" />
              Saídas
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
