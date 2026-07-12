import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export type ToastInput = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastItem = ToastInput & {
  id: string;
};

type ToastContextValue = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClass: Record<ToastVariant, string> = {
  default: 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg)]',
  success:
    'border-[var(--color-success-500)] bg-[var(--color-bg-elevated)] text-[var(--color-success-700)]',
  warning:
    'border-[var(--color-warning-500)] bg-[var(--color-bg-elevated)] text-[var(--color-warning-700)]',
  danger:
    'border-[var(--color-danger-500)] bg-[var(--color-bg-elevated)] text-[var(--color-danger-700)]',
  info: 'border-[var(--color-info-500)] bg-[var(--color-bg-elevated)] text-[var(--color-info-700)]',
};

function ToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[var(--z-toast)] flex w-[min(100%-2rem,22rem)] flex-col gap-2"
      aria-live="polite"
      aria-relevant="additions"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'pointer-events-auto animate-[cp-toast-in_var(--duration-normal)_var(--ease-standard)] rounded-[var(--radius-md)] border-l-4 p-3 shadow-[var(--shadow-md)]',
            variantClass[item.variant ?? 'default'],
          )}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {item.title && <p className="text-sm font-semibold">{item.title}</p>}
              {item.description && (
                <p className="mt-0.5 text-sm text-[var(--color-fg-muted)]">{item.description}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Dispensar notificação"
              className="rounded-[var(--radius-sm)] px-1.5 text-xs font-medium text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-fg)]"
              onClick={() => onDismiss(item.id)}
            >
              Fechar
            </button>
          </div>
        </div>
      ))}
    </div>,
    document.body,
  );
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `toast-${Date.now()}`;
      const durationMs = input.durationMs ?? 4000;
      setItems((current) => [...current, { ...input, id }]);
      window.setTimeout(() => dismiss(id), durationMs);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return createElement(
    ToastContext.Provider,
    { value },
    children as ReactNode,
    createElement(ToastViewport, { items, onDismiss: dismiss }),
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
