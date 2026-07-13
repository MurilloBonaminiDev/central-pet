import type { ChartPoint } from '@central-pet/shared';

type Props = {
  title: string;
  subtitle: string;
  data: ChartPoint[];
};

export function AppointmentsChart({ title, subtitle, data }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const hasData = data.some((d) => d.value > 0);

  return (
    <section className="cp-dash-rise relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)] md:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--color-accent-400)]/12 to-transparent"
        aria-hidden
      />
      <header className="relative mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-[var(--color-fg)] md:text-2xl">
            {title}
          </h3>
          <p className="text-sm text-[var(--color-fg-muted)]">{subtitle}</p>
        </div>
        <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] px-3 py-1.5 text-sm font-semibold text-[var(--color-fg)]">
          {total} no período
        </div>
      </header>

      {!hasData ? (
        <p className="relative py-16 text-center text-sm text-[var(--color-fg-muted)]">
          Ainda não há atendimentos concluídos para exibir.
        </p>
      ) : (
        <div className="relative flex h-56 items-end gap-2.5 sm:gap-3">
          {data.map((item, index) => {
            const height = `${Math.max((item.value / max) * 100, item.value > 0 ? 8 : 2)}%`;
            return (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-[var(--color-fg-muted)]">
                  {item.value}
                </span>
                <div className="relative flex h-44 w-full items-end justify-center overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-muted)]/70">
                  <div
                    className="cp-bar-grow w-[72%] rounded-[var(--radius-md)] bg-gradient-to-t from-[var(--color-brand-800)] via-[var(--color-brand-500)] to-[var(--color-accent-400)]"
                    style={{
                      height,
                      animationDelay: `${120 + index * 70}ms`,
                    }}
                    title={`${item.label}: ${item.value}`}
                  />
                </div>
                <span className="text-[10px] font-medium text-[var(--color-fg-subtle)] sm:text-xs">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
