import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

export type BreadcrumbProps = HTMLAttributes<HTMLElement> & {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  linkComponent?: (props: { href: string; children: ReactNode; className?: string }) => ReactNode;
};

export function Breadcrumb({
  className,
  items,
  separator = '/',
  linkComponent,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)} {...props}>
      <ol className="flex flex-wrap items-center gap-2 text-[var(--color-fg-muted)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.current;
          const content = (
            <span
              className={cn(
                isLast ? 'font-medium text-[var(--color-fg)]' : 'hover:text-[var(--color-fg)]',
              )}
            >
              {item.label}
            </span>
          );

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden className="text-[var(--color-fg-subtle)]">
                  {separator}
                </span>
              )}
              {item.href && !isLast ? (
                linkComponent ? (
                  linkComponent({ href: item.href, children: content, className: 'no-underline' })
                ) : (
                  <a href={item.href} className="no-underline">
                    {content}
                  </a>
                )
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
