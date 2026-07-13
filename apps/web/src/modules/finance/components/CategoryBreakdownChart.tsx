import type { FinanceCategoryBreakdown } from '@central-pet/shared';
import { formatBRL } from '../api';

type Props = {
  title: string;
  subtitle: string;
  data: FinanceCategoryBreakdown[];
  emptyLabel?: string;
  tone?: 'income' | 'expense';
};

export function CategoryBreakdownChart({
  title,
  subtitle,
  data,
  emptyLabel = 'Nenhuma movimentação neste período.',
  tone = 'income',
}: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barClass =
    tone === 'income'
      ? 'from-[var(--color-success-600)] to-[var(--color-brand-400)]'
      : 'from-[var(--color-warning-600)] to-[var(--color-accent-400)]';

  return (
    <section className="cp-dash-rise relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)] md:p-6">
      <header className="relative mb-5">
        <h3 className="font-display text-xl font-semibold text-[var(--color-fg)] md:text-2xl">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-fg-muted)]">{subtitle}</p>
      </header>

      {data.length === 0 ? (
        <p className="relative py-12 text-center text-sm text-[var(--color-fg-muted)]">
          {emptyLabel}
        </p>
      ) : (
        <ul className="relative space-y-4">
          {data.map((item) => (
            <li key={item.category}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[var(--color-fg)]">{item.label}</span>
                <span className="shrink-0 font-semibold text-[var(--color-fg)]">
                  {formatBRL(item.value)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${barClass}`}
                  style={{ width: `${Math.max((item.value / max) * 100, 4)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
