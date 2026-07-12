import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type SelectSize = 'sm' | 'md' | 'lg';

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  selectSize?: SelectSize;
  invalid?: boolean;
};

const sizeClass: Record<SelectSize, string> = {
  sm: 'h-[var(--control-height-sm)] pl-3 pr-8 text-sm',
  md: 'h-[var(--control-height-md)] pl-3.5 pr-9 text-sm',
  lg: 'h-[var(--control-height-lg)] pl-4 pr-10 text-base',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, selectSize = 'md', invalid = false, children, ...props },
  ref,
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'w-full appearance-none rounded-[var(--radius-md)] border bg-[var(--color-bg-elevated)] text-[var(--color-fg)]',
          'transition-colors duration-[var(--duration-fast)]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--color-border-focus)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid
            ? 'border-[var(--color-danger-500)]'
            : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
          sizeClass[selectSize],
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-fg-muted)]"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
});
