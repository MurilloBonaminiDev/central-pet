import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../utils/cn';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
};

export function Card({ className, padded = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)]',
        padded && 'p-5',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn('mb-4 flex flex-col gap-1', className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h3
      className={cn('font-display text-lg font-semibold text-[var(--color-fg)]', className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) {
  return <p className={cn('text-sm text-[var(--color-fg-muted)]', className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn('mt-5 flex items-center gap-3 border-t border-[var(--color-border)] pt-4', className)}
      {...props}
    />
  );
}
