import {
  useEffect,
  useId,
  type HTMLAttributes,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { Button } from '../primitives/Button';

export type ModalProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlay?: boolean;
  className?: string;
}>;

const sizeClass = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
} as const;

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  closeOnOverlay = true,
  className,
  children,
}: ModalProps) {
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
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        className="absolute inset-0 animate-[cp-fade-in_var(--duration-normal)_var(--ease-standard)] bg-[var(--color-overlay)]"
        onClick={onOverlayClick}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative z-10 w-full rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-lg)]',
          'animate-[cp-modal-in_var(--duration-normal)_var(--ease-emphasized)]',
          sizeClass[size],
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
        <div className="px-5 py-4 text-[var(--color-fg)]">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export type ModalSectionProps = HTMLAttributes<HTMLDivElement>;
export function ModalBody({ className, ...props }: ModalSectionProps) {
  return <div className={cn('space-y-3', className)} {...props} />;
}
