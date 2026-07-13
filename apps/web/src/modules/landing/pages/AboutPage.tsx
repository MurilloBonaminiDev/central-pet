import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/paths';
import '../styles/landing.css';
import { SiteLayout } from '../components/SiteLayout';
import { SitePageHero } from '../components/SitePageHero';
import { CLINIC } from '../data/clinic';

export function AboutPage() {
  return (
    <SiteLayout>
      <SitePageHero
        eyebrow="Sobre a clínica"
        title="Conheça a Central Pet"
        description="Mais de uma década cuidando de pets com medicina veterinária de qualidade, estrutura completa e atendimento humanizado."
      />

      <section className="py-20 sm:py-24" aria-labelledby="about-history-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
                História
              </p>
              <h2
                id="about-history-title"
                className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
              >
                {CLINIC.history.title}
              </h2>
              {CLINIC.history.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-brand-50)] p-6 text-center">
                <p className="font-display text-3xl font-semibold text-[var(--color-brand-700)]">
                  {CLINIC.history.founded}
                </p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Fundada em</p>
              </div>
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-brand-50)] p-6 text-center">
                <p className="font-display text-3xl font-semibold text-[var(--color-brand-700)]">
                  {CLINIC.history.petsAttended}
                </p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Pets atendidos</p>
              </div>
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-brand-50)] p-6 text-center">
                <p className="font-display text-3xl font-semibold text-[var(--color-brand-700)]">
                  {CLINIC.history.yearsExperience}
                </p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Anos de experiência</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20 sm:py-24"
        aria-labelledby="about-team-title"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
              Equipe
            </p>
            <h2
              id="about-team-title"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              Profissionais dedicados ao seu pet
            </h2>
            <p className="mt-3 text-base text-[var(--color-fg-muted)]">
              Médicos veterinários e equipe de apoio comprometidos com excelência e carinho.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CLINIC.team.map((member) => (
              <li
                key={member.name}
                className="home-glass-card overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[var(--color-bg-subtle)]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-[var(--color-fg)]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[var(--color-brand-700)]">
                    {member.role}
                  </p>
                  {member.crmv ? (
                    <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">{member.crmv}</p>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {member.bio}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="about-structure-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
              Estrutura
            </p>
            <h2
              id="about-structure-title"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              Infraestrutura pensada para o bem-estar
            </h2>
            <p className="mt-3 text-base text-[var(--color-fg-muted)]">
              Ambientes modernos, equipamentos de qualidade e fluxo organizado para reduzir
              o estresse do pet e do tutor.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLINIC.structure.map((item) => (
              <li
                key={item.title}
                className="home-glass-card rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-sm)]"
              >
                <h3 className="font-display text-lg font-semibold text-[var(--color-fg)]">
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

      <section
        className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20 sm:py-24"
        aria-labelledby="about-specialties-title"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
              Especialidades
            </p>
            <h2
              id="about-specialties-title"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              Áreas de atuação
            </h2>
            <p className="mt-3 text-base text-[var(--color-fg-muted)]">
              Atendimento multidisciplinar para cobrir as principais necessidades de saúde do
              seu pet.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLINIC.specialties.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)]"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-100)] text-sm font-bold text-[var(--color-brand-700)]"
                >
                  ✓
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--color-fg)]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <Link
              to={ROUTES.servicos}
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-6 text-sm font-semibold text-[var(--color-primary-fg)] transition-colors hover:bg-[var(--color-brand-700)]"
            >
              Ver todos os serviços
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
