import type { ChartPoint } from '@central-pet/shared';
import { formatBRL } from '../api';

type Props = {
  title: string;
  subtitle: string;
  data: ChartPoint[];
};

export function FinanceChart({ title, subtitle, data }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const hasData = data.some((d) => d.value > 0);
  const width = 640;
  const height = 240;
  const padX = 32;
  const padY = 28;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((d, i) => {
    const x = padX + (i / Math.max(data.length - 1, 1)) * innerW;
    const y = padY + innerH - (d.value / max) * innerH;
    return { ...d, x, y };
  });

  const line = points.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `${points[0]?.x ?? padX},${padY + innerH} ${line} ${points.at(-1)?.x ?? padX},${padY + innerH}`;

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
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.06em] text-[var(--color-fg-subtle)]">
            Total período
          </p>
          <p className="font-display text-lg font-semibold text-[var(--color-brand-700)] dark:text-[var(--color-brand-300)]">
            {formatBRL(total)}
          </p>
        </div>
      </header>

      {!hasData ? (
        <p className="relative py-16 text-center text-sm text-[var(--color-fg-muted)]">
          Ainda não há receita registrada (serviços concluídos).
        </p>
      ) : (
        <div className="relative overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-60 w-full min-w-[30rem]" role="img">
            <defs>
              <linearGradient id="financeFillPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-400)" stopOpacity="0.42" />
                <stop offset="100%" stopColor="var(--color-brand-400)" stopOpacity="0.02" />
              </linearGradient>
            </defs>
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
            <polygon points={area} fill="url(#financeFillPremium)" />
            <polyline
              points={line}
              fill="none"
              stroke="var(--color-brand-600)"
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((p) => (
              <g key={p.label}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="var(--color-bg-elevated)"
                  stroke="var(--color-accent-500)"
                  strokeWidth="2.75"
                />
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill="var(--color-fg-muted)"
                  fontSize="11"
                  fontWeight="600"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}
