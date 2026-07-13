import type { FinanceTransaction } from '@central-pet/shared';
import { Button } from '@central-pet/ui';
import { formatBRLFromCents } from '../api';

type Props = {
  items: FinanceTransaction[];
  busyId?: string | null;
  onDelete?: (id: string) => void;
};

function formatDate(isoDate: string) {
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

export function FinanceMovementsTable({ items, busyId, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <p className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-12 text-center text-sm text-[var(--color-fg-muted)]">
        Nenhuma movimentação registrada ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Data</th>
            <th className="px-4 py-3 font-semibold">Tipo</th>
            <th className="px-4 py-3 font-semibold">Categoria</th>
            <th className="px-4 py-3 font-semibold">Descrição</th>
            <th className="px-4 py-3 font-semibold text-right">Valor</th>
            {onDelete ? <th className="px-4 py-3 font-semibold text-right">Ações</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isIncome = item.type === 'ENTRADA';
            return (
              <tr
                key={item.id}
                className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-subtle)]/60"
              >
                <td className="whitespace-nowrap px-4 py-3 text-[var(--color-fg-muted)]">
                  {formatDate(item.occurred_on)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isIncome
                        ? 'bg-[var(--color-success-500)]/15 text-[var(--color-success-700)]'
                        : 'bg-[var(--color-warning-500)]/15 text-[var(--color-warning-700)]'
                    }`}
                  >
                    {isIncome ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-fg)]">{item.category_label}</td>
                <td className="max-w-xs truncate px-4 py-3 text-[var(--color-fg)]">
                  {item.description}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                    isIncome
                      ? 'text-[var(--color-success-700)]'
                      : 'text-[var(--color-warning-700)]'
                  }`}
                >
                  {isIncome ? '+' : '−'}
                  {formatBRLFromCents(item.amount_cents)}
                </td>
                {onDelete ? (
                  <td className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busyId === item.id}
                      onClick={() => onDelete(item.id)}
                    >
                      {busyId === item.id ? '…' : 'Excluir'}
                    </Button>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
