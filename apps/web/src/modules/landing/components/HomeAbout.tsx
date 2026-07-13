import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/paths';
import { CLINIC } from '../data/clinic';

export function HomeAbout() {
  return (
    <section
      className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
      aria-labelledby="home-about-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
              Apresentação
            </p>
            <h2
              id="home-about-title"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              {CLINIC.presentation.title}
            </h2>
            {CLINIC.presentation.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)] sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
            <Link
              to={ROUTES.sobre}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)] transition-colors hover:text-[var(--color-brand-800)]"
            >
              Conheça nossa história
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="home-glass-card rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-center shadow-[var(--shadow-sm)]">
              <p className="font-display text-3xl font-semibold text-[var(--color-brand-700)]">
                {CLINIC.history.founded}
              </p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Ano de fundação</p>
            </div>
            <div className="home-glass-card rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-center shadow-[var(--shadow-sm)]">
              <p className="font-display text-3xl font-semibold text-[var(--color-brand-700)]">
                {CLINIC.history.petsAttended}
              </p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Pets atendidos</p>
            </div>
            <div className="home-glass-card rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-center shadow-[var(--shadow-sm)]">
              <p className="font-display text-3xl font-semibold text-[var(--color-brand-700)]">
                {CLINIC.history.yearsExperience}
              </p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Anos de experiência</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
