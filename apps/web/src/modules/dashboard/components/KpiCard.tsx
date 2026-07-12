import type { ReactNode } from 'react';
import { cn } from '@central-pet/ui';

type KpiCardProps = {
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  accent?: 'brand' | 'accent' | 'info' | 'success' | 'warning';
  icon?: ReactNode;
  spark?: number[];
  delayMs?: number;
};

const accentStyles = {
  brand: {
    wash: 'from-[var(--color-brand-500)]/18 via-[var(--color-brand-400)]/8 to-transparent',
    icon: 'bg-[var(--color-brand-600)] text-[var(--color-primary-fg)]',
    spark: 'var(--color-brand-500)',
    delta: 'text-[var(--color-brand-700)] dark:text-[var(--color-brand-300)]',
  },
  accent: {
    wash: 'from-[var(--color-accent-500)]/20 via-[var(--color-accent-400)]/10 to-transparent',
    icon: 'bg-[var(--color-accent-500)] text-[var(--color-neutral-950)]',
    spark: 'var(--color-accent-500)',
    delta: 'text-[var(--color-accent-700)]',
  },
  info: {
    wash: 'from-[var(--color-info-500)]/18 via-transparent to-transparent',
    icon: 'bg-[var(--color-info-600)] text-white',
    spark: 'var(--color-info-500)',
    delta: 'text-[var(--color-info-700)]',
  },
  success: {
    wash: 'from-[var(--color-success-500)]/18 via-transparent to-transparent',
    icon: 'bg-[var(--color-success-600)] text-white',
    spark: 'var(--color-success-500)',
    delta: 'text-[var(--color-success-700)]',
  },
  warning: {
    wash: 'from-[var(--color-warning-500)]/20 via-transparent to-transparent',
    icon: 'bg-[var(--color-warning-500)] text-[var(--color-neutral-950)]',
    spark: 'var(--color-warning-500)',
    delta: 'text-[var(--color-warning-700)]',
  },
} as const;

function MiniSpark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  const w = 72;
  const h = 28;
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - (v / max) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="opacity-90">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  delta,
  accent = 'brand',
  icon,
  spark,
  delayMs = 0,
}: KpiCardProps) {
  const styles = accentStyles[accent];

  return (
    <article
      className={cn(
        'cp-dash-rise group relative overflow-hidden rounded-[var(--radius-xl)]',
        'border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5',
        'shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-[var(--duration-normal)]',
        'hover:-translate-y-1 hover:shadow-[var(--shadow-md)]',
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div
        className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br', styles.wash)}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[var(--color-bg-muted)]/40 blur-2xl transition-opacity group-hover:opacity-80"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-fg-muted)]">
            {label}
          </p>
          <p className="mt-2 font-display text-[1.85rem] font-semibold leading-none tracking-tight text-[var(--color-fg)] md:text-3xl">
            {value}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {delta && (
              <span className={cn('text-xs font-semibold', styles.delta)}>{delta}</span>
            )}
            {hint && <span className="text-xs text-[var(--color-fg-subtle)]">{hint}</span>}
          </div>
        </div>
        {icon && (
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]',
              styles.icon,
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {spark && spark.length > 1 && (
        <div className="relative mt-4 flex justify-end">
          <MiniSpark values={spark} color={styles.spark} />
        </div>
      )}
    </article>
  );
}
