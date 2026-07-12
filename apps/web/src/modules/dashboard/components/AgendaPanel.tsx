import { Badge } from '@central-pet/ui';
import type { AgendaItem } from '../data/mock';

const typeLabel: Record<AgendaItem['type'], string> = {
  consulta: 'Consulta',
  banho: 'Banho',
  vacina: 'Vacina',
  retorno: 'Retorno',
};

const typeVariant: Record<AgendaItem['type'], 'brand' | 'accent' | 'success' | 'info'> = {
  consulta: 'brand',
  banho: 'accent',
  vacina: 'success',
  retorno: 'info',
};

const railColor: Record<AgendaItem['type'], string> = {
  consulta: 'bg-[var(--color-brand-500)]',
  banho: 'bg-[var(--color-accent-500)]',
  vacina: 'bg-[var(--color-success-500)]',
  retorno: 'bg-[var(--color-info-500)]',
};

type Props = {
  items: AgendaItem[];
};

export function AgendaPanel({ items }: Props) {
  return (
    <section className="cp-dash-rise rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)] md:p-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-[var(--color-fg)] md:text-2xl">
            Agenda
          </h3>
          <p className="text-sm text-[var(--color-fg-muted)]">Linha do tempo de hoje</p>
        </div>
        <Badge variant="brand">{items.length} itens</Badge>
      </header>
      <ul className="relative space-y-3 before:absolute before:bottom-3 before:left-[1.15rem] before:top-3 before:w-px before:bg-[var(--color-border)]">
        {items.map((item) => (
          <li
            key={item.id}
            className="relative flex items-stretch gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)]/70 bg-[var(--color-bg-subtle)]/80 p-3 transition-colors hover:bg-[var(--color-bg-muted)]"
          >
            <div className="relative z-10 flex w-14 shrink-0 flex-col items-center">
              <span
                className={`mt-1 h-2.5 w-2.5 rounded-full ring-4 ring-[var(--color-bg-elevated)] ${railColor[item.type]}`}
              />
              <span className="mt-2 text-xs font-bold text-[var(--color-fg)]">{item.time}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="truncate font-semibold text-[var(--color-fg)]">{item.title}</p>
                <Badge variant={typeVariant[item.type]}>{typeLabel[item.type]}</Badge>
              </div>
              <p className="text-sm text-[var(--color-fg-muted)]">
                {item.pet}
                <span className="mx-1.5 text-[var(--color-fg-subtle)]">·</span>
                {item.tutor}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
