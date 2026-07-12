import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Button } from '../primitives/Button';
import { useThemeOptional } from '../theme';

export type NavbarProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  showThemeToggle?: boolean;
  onMenuClick?: () => void;
};

export function Navbar({
  className,
  title,
  subtitle,
  leading,
  trailing,
  showThemeToggle = true,
  onMenuClick,
  ...props
}: NavbarProps) {
  return (
    <header
      className={cn(
        'flex h-[var(--navbar-height)] items-center justify-between gap-4 border-b border-[var(--color-navbar-border)] bg-[var(--color-navbar-bg)] px-4 md:px-6',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick && (
          <Button variant="ghost" size="sm" aria-label="Abrir menu" onClick={onMenuClick}>
            Menu
          </Button>
        )}
        {leading}
        {(title || subtitle) && (
          <div className="min-w-0">
            {title && (
              <h1 className="truncate font-display text-lg font-semibold text-[var(--color-fg)]">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="truncate text-sm text-[var(--color-fg-muted)]">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {showThemeToggle && <ThemeToggle />}
        {trailing}
      </div>
    </header>
  );
}

function ThemeToggle() {
  const theme = useThemeOptional();
  if (!theme) return null;
  const { resolved, toggle } = theme;
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={resolved === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onClick={toggle}
    >
      {resolved === 'dark' ? 'Claro' : 'Escuro'}
    </Button>
  );
}

/** Standalone theme toggle for use when ThemeProvider is present. */
export function ThemeToggleButton({ className }: { className?: string }) {
  const theme = useThemeOptional();
  if (!theme) return null;
  const { resolved, toggle } = theme;
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      aria-label={resolved === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onClick={toggle}
    >
      {resolved === 'dark' ? 'Modo claro' : 'Modo escuro'}
    </Button>
  );
}
