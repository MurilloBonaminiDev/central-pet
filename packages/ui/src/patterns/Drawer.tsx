import {
  useEffect,
  useId,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { Button } from '../primitives/Button';

export type DrawerSide = 'left' | 'right';

export type DrawerProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  side?: DrawerSide;
  footer?: ReactNode;
  widthClassName?: string;
  closeOnOverlay?: boolean;
  className?: string;
}>;

export function Drawer({
  open,
  onClose,
  title,
  description,
  side = 'right',
  footer,
  widthClassName = 'max-w-md',
  closeOnOverlay = true,
  className,
  children,
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const onOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlay) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[var(--z-modal)]" role="presentation">
      <div
        className="absolute inset-0 animate-[cp-fade-in_var(--duration-normal)_var(--ease-standard)] bg-[var(--color-overlay)]"
        onClick={onOverlayClick}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'absolute inset-y-0 flex w-full flex-col border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-lg)]',
          widthClassName,
          side === 'right'
            ? 'right-0 border-l animate-[cp-drawer-in-right_var(--duration-normal)_var(--ease-emphasized)]'
            : 'left-0 border-r animate-[cp-drawer-in-left_var(--duration-normal)_var(--ease-emphasized)]',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
          <div className="min-w-0">
            {title && (
              <h2 id={titleId} className="font-display text-xl font-semibold text-[var(--color-fg)]">
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-[var(--color-fg-muted)]">
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" aria-label="Fechar" onClick={onClose}>
            Fechar
          </Button>
        </div>
        <div className="cp-scrollbar flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-5 py-4">
            {footer}
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}
