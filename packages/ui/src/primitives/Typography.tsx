import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
};

const headingClass: Record<HeadingLevel, string> = {
  1: 'text-4xl',
  2: 'text-3xl',
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-lg',
  6: 'text-base',
};

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const classes = cn(
    'font-display font-semibold tracking-[var(--tracking-tight)] text-[var(--color-fg)]',
    headingClass[level],
    className,
  );

  switch (level) {
    case 1:
      return <h1 className={classes} {...props} />;
    case 2:
      return <h2 className={classes} {...props} />;
    case 3:
      return <h3 className={classes} {...props} />;
    case 4:
      return <h4 className={classes} {...props} />;
    case 5:
      return <h5 className={classes} {...props} />;
    case 6:
      return <h6 className={classes} {...props} />;
  }
}

export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  muted?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const textSizeClass = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
} as const;

export function Text({ className, muted = false, size = 'md', ...props }: TextProps) {
  return (
    <p
      className={cn(
        'font-sans leading-[var(--leading-normal)]',
        textSizeClass[size],
        muted ? 'text-[var(--color-fg-muted)]' : 'text-[var(--color-fg)]',
        className,
      )}
      {...props}
    />
  );
}

export type LabelProps = HTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-[var(--color-fg)]', className)}
      {...props}
    />
  );
}
