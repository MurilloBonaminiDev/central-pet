type ClientePageStubProps = {
  title: string;
  description: string;
};

export function ClientePageStub({ title, description }: ClientePageStubProps) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 shadow-[var(--shadow-sm)]">
      <h2 className="font-display text-2xl font-semibold text-[var(--color-fg)]">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
        {description}
      </p>
      <p className="mt-6 text-xs font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
        Estrutura de interface — sem backend
      </p>
    </section>
  );
}
