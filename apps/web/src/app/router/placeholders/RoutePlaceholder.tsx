type RoutePlaceholderProps = {
  title: string;
};

/** Structural route stub — no page implementation. */
export function RoutePlaceholder({ title }: RoutePlaceholderProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <p className="text-sm text-[var(--color-fg-muted)]">{title}</p>
    </main>
  );
}
