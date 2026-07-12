import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type SidebarItem = {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  brand?: ReactNode;
  items?: SidebarItem[];
  footer?: ReactNode;
  collapsed?: boolean;
  linkComponent?: (props: {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
  }) => ReactNode;
};

export function Sidebar({
  className,
  brand,
  items = [],
  footer,
  collapsed = false,
  linkComponent,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-fg)]',
        'transition-[width] duration-[var(--duration-normal)] ease-[var(--ease-standard)]',
        collapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex h-[var(--navbar-height)] items-center border-b border-white/10 px-4',
          collapsed && 'justify-center px-2',
        )}
      >
        {brand ?? (
          <span className="font-display text-lg font-semibold tracking-tight">
            {collapsed ? 'CP' : 'Central Pet'}
          </span>
        )}
      </div>

      <nav className="cp-scrollbar flex-1 overflow-y-auto px-2 py-4">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const content = (
              <span
                className={cn(
                  'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-[var(--color-sidebar-active-bg)] text-white'
                    : 'text-[var(--color-sidebar-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-sidebar-fg)]',
                  collapsed && 'justify-center px-2',
                )}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </span>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  linkComponent ? (
                    linkComponent({
                      href: item.href,
                      onClick: item.onClick,
                      className: 'block no-underline',
                      children: content,
                    })
                  ) : (
                    <a href={item.href} onClick={item.onClick} className="block no-underline">
                      {content}
                    </a>
                  )
                ) : (
                  <button type="button" onClick={item.onClick} className="w-full text-left">
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {footer && (
        <div
          className={cn(
            'border-t border-white/10 p-3 text-sm text-[var(--color-sidebar-muted)]',
            collapsed && 'flex justify-center',
          )}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}
