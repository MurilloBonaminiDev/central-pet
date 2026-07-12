import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
};

const variantClass: Record<AlertVariant, string> = {
  info: 'border-[var(--color-info-500)] bg-[var(--color-info-50)] text-[var(--color-info-700)]',
  success:
    'border-[var(--color-success-500)] bg-[var(--color-success-50)] text-[var(--color-success-700)]',
  warning:
    'border-[var(--color-warning-500)] bg-[var(--color-warning-50)] text-[var(--color-warning-700)]',
  danger:
    'border-[var(--color-danger-500)] bg-[var(--color-danger-50)] text-[var(--color-danger-700)]',
};

export function Alert({
  className,
  variant = 'info',
  title,
  icon,
  children,
  ...props
}: PropsWithChildren<AlertProps>) {
  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-[var(--radius-md)] border-l-4 px-4 py-3',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="min-w-0 flex-1">
        {title && <p className="mb-0.5 text-sm font-semibold">{title}</p>}
        {children && <div className="text-sm opacity-90">{children}</div>}
      </div>
    </div>
  );
}
