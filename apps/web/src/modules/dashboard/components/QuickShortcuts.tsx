import { cn } from '@central-pet/ui';
import type { Shortcut } from '../data/mock';

const toneClass: Record<Shortcut['tone'], string> = {
  brand:
    'from-[var(--color-brand-600)] to-[var(--color-brand-800)] text-[var(--color-primary-fg)] hover:brightness-110',
  accent:
    'from-[var(--color-accent-400)] to-[var(--color-accent-600)] text-[var(--color-neutral-950)] hover:brightness-105',
  info: 'from-[var(--color-info-500)] to-[var(--color-info-700)] text-white hover:brightness-110',
  success:
    'from-[var(--color-success-500)] to-[var(--color-success-700)] text-white hover:brightness-110',
};

type Props = {
  items: Shortcut[];
};

export function QuickShortcuts({ items }: Props) {
  return (
    <section className="cp-dash-rise rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)] md:p-6">
      <header className="mb-4">
        <h3 className="font-display text-xl font-semibold text-[var(--color-fg)] md:text-2xl">
          Atalhos rápidos
        </h3>
        <p className="text-sm text-[var(--color-fg-muted)]">Ações frequentes da clínica</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              'cp-dash-rise group relative overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br px-4 py-4 text-left shadow-[var(--shadow-sm)] transition-transform duration-[var(--duration-fast)] hover:-translate-y-0.5',
              toneClass[item.tone],
            )}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className="cp-hero-sheen pointer-events-none absolute inset-0 opacity-60" />
            <p className="relative font-semibold">{item.label}</p>
            <p className="relative mt-1 text-sm opacity-90">{item.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
