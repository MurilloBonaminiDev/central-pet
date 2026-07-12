import { Badge } from '@central-pet/ui';
import type { AttendanceItem } from '../data/mock';

const statusLabel: Record<AttendanceItem['status'], string> = {
  concluido: 'Concluído',
  em_andamento: 'Em andamento',
  aguardando: 'Aguardando',
};

const statusVariant: Record<AttendanceItem['status'], 'success' | 'warning' | 'neutral'> = {
  concluido: 'success',
  em_andamento: 'warning',
  aguardando: 'neutral',
};

type Props = {
  items: AttendanceItem[];
};

export function RecentAttendances({ items }: Props) {
  return (
    <section className="cp-dash-rise overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)]">
      <header className="border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-bg-muted)]/80 to-transparent px-5 py-4 md:px-6">
        <h3 className="font-display text-xl font-semibold text-[var(--color-fg)] md:text-2xl">
          Últimos atendimentos
        </h3>
        <p className="text-sm text-[var(--color-fg-muted)]">Fluxo recente da operação</p>
      </header>
      <div className="overflow-x-auto p-2 md:p-3">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="text-[var(--color-fg-muted)]">
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em]">Pet</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em]">Serviço</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em]">
                Profissional
              </th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em]">Quando</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em]">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-[var(--color-border)]/70 transition-colors hover:bg-[var(--color-bg-subtle)]"
              >
                <td className="px-3 py-3.5">
                  <p className="font-semibold text-[var(--color-fg)]">{item.pet}</p>
                  <p className="text-xs text-[var(--color-fg-subtle)]">{item.tutor}</p>
                </td>
                <td className="px-3 py-3.5 text-[var(--color-fg)]">{item.service}</td>
                <td className="px-3 py-3.5 text-[var(--color-fg-muted)]">{item.professional}</td>
                <td className="px-3 py-3.5 text-[var(--color-fg-muted)]">{item.time}</td>
                <td className="px-3 py-3.5">
                  <Badge variant={statusVariant[item.status]}>{statusLabel[item.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
