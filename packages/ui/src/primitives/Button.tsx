import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:bg-[var(--color-primary-hover)] border-transparent',
  secondary:
    'bg-[var(--color-secondary)] text-[var(--color-secondary-fg)] hover:bg-[var(--color-secondary-hover)] border-transparent',
  accent:
    'bg-[var(--color-accent-500)] text-[var(--color-neutral-950)] hover:bg-[var(--color-accent-600)] border-transparent',
  ghost:
    'bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-bg-muted)] border-transparent',
  danger:
    'bg-[var(--color-danger-600)] text-white hover:bg-[var(--color-danger-700)] border-transparent',
  outline:
    'bg-transparent text-[var(--color-fg)] border-[var(--color-border-strong)] hover:bg-[var(--color-bg-muted)]',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-[var(--control-height-sm)] px-3 text-sm gap-1.5',
  md: 'h-[var(--control-height-md)] px-4 text-sm gap-2',
  lg: 'h-[var(--control-height-lg)] px-5 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    type = 'button',
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius-md)] border font-medium',
        'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  );
});
