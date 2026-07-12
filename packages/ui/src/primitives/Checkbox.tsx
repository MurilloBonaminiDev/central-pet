import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  description?: string;
  invalid?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, description, invalid = false, id, disabled, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <label
      className={cn(
        'inline-flex gap-3',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            'peer h-5 w-5 appearance-none rounded-[var(--radius-sm)] border bg-[var(--color-bg-elevated)]',
            'transition-colors duration-[var(--duration-fast)]',
            'checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
            invalid ? 'border-[var(--color-danger-500)]' : 'border-[var(--color-border-strong)]',
          )}
          {...props}
        />
        <svg
          aria-hidden
          className="pointer-events-none absolute hidden h-3.5 w-3.5 text-[var(--color-primary-fg)] peer-checked:block"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3.5 8.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {(label || description) && (
        <span className="flex min-w-0 flex-col gap-0.5">
          {label && (
            <span className="text-sm font-medium text-[var(--color-fg)]">{label}</span>
          )}
          {description && (
            <span className="text-sm text-[var(--color-fg-muted)]">{description}</span>
          )}
        </span>
      )}
    </label>
  );
});
