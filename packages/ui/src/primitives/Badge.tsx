import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type BadgeVariant = 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClass: Record<BadgeVariant, string> = {
  neutral: 'bg-[var(--color-bg-muted)] text-[var(--color-fg-muted)]',
  brand:
    'bg-[var(--color-brand-100)] text-[var(--color-brand-800)] dark:bg-[var(--color-brand-900)] dark:text-[var(--color-brand-100)]',
  accent: 'bg-[var(--color-accent-100)] text-[var(--color-accent-800)]',
  success: 'bg-[var(--color-success-50)] text-[var(--color-success-700)]',
  warning: 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)]',
  danger: 'bg-[var(--color-danger-50)] text-[var(--color-danger-700)]',
  info: 'bg-[var(--color-info-50)] text-[var(--color-info-700)]',
};

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-semibold tracking-wide',
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
