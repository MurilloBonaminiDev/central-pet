import type { Differentiator } from '../data/clinic';
import { CLINIC } from '../data/clinic';

function DiffIcon({ icon }: { icon: Differentiator['icon'] }) {
  const paths: Record<Differentiator['icon'], string> = {
    human:
      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    structure:
      'M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z',
    tech:
      'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z',
    care:
      'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  };

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={paths[icon]} />
    </svg>
  );
}

export function HomeDifferentiators() {
  return (
    <section
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20 sm:py-24"
      aria-labelledby="home-diff-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
            Diferenciais
          </p>
          <h2
            id="home-diff-title"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            Por que escolher a Central Pet?
          </h2>
          <p className="mt-3 text-base text-[var(--color-fg-muted)]">
            Combinamos medicina veterinária de qualidade com uma experiência acolhedora para
            tutores e pets.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLINIC.differentiators.map((item) => (
            <li
              key={item.title}
              className="home-glass-card group rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)] transition-colors group-hover:bg-[var(--color-brand-100)]">
                <DiffIcon icon={item.icon} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-[var(--color-fg)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
