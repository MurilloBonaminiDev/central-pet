type SitePageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SitePageHero({ eyebrow, title, description }: SitePageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-brand-950)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 0%, color-mix(in srgb, var(--color-brand-400) 35%, transparent), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, color-mix(in srgb, var(--color-accent-300) 20%, transparent), transparent)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-300)]">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-brand-100)] sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
