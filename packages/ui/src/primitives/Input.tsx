import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type InputSize = 'sm' | 'md' | 'lg';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  inputSize?: InputSize;
  invalid?: boolean;
};

const sizeClass: Record<InputSize, string> = {
  sm: 'h-[var(--control-height-sm)] px-3 text-sm',
  md: 'h-[var(--control-height-md)] px-3.5 text-sm',
  lg: 'h-[var(--control-height-lg)] px-4 text-base',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, inputSize = 'md', invalid = false, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-[var(--radius-md)] border bg-[var(--color-bg-elevated)] text-[var(--color-fg)]',
        'placeholder:text-[var(--color-fg-subtle)]',
        'transition-colors duration-[var(--duration-fast)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--color-border-focus)]',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg-muted)]',
        invalid
          ? 'border-[var(--color-danger-500)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
        sizeClass[inputSize],
        className,
      )}
      {...props}
    />
  );
});
