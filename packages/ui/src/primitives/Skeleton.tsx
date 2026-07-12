import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
};

const roundedClass = {
  sm: 'rounded-[var(--radius-sm)]',
  md: 'rounded-[var(--radius-md)]',
  lg: 'rounded-[var(--radius-lg)]',
  full: 'rounded-[var(--radius-full)]',
} as const;

export function Skeleton({
  className,
  width,
  height,
  rounded = 'md',
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-[cp-skeleton-pulse_1.4s_ease-in-out_infinite] bg-[var(--color-bg-muted)]',
        roundedClass[rounded],
        className,
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}
