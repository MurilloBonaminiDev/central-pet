import type { ChartPoint } from '@central-pet/shared';

type Props = {
  title: string;
  subtitle: string;
  data: ChartPoint[];
};

export function TopServicesChart({ title, subtitle, data }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <section className="cp-dash-rise relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)] md:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--color-brand-400)]/10 to-transparent"
        aria-hidden
      />
      <header className="relative mb-5">
        <h3 className="font-display text-xl font-semibold text-[var(--color-fg)] md:text-2xl">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-fg-muted)]">{subtitle}</p>
      </header>

      {data.length === 0 ? (
        <p className="relative py-12 text-center text-sm text-[var(--color-fg-muted)]">
          Nenhum serviço concluído ainda.
        </p>
      ) : (
        <ul className="relative space-y-4">
          {data.map((item) => (
            <li key={item.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[var(--color-fg)]">{item.label}</span>
                <span className="shrink-0 font-semibold text-[var(--color-brand-700)]">
                  {item.value}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-600)] to-[var(--color-accent-400)]"
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
