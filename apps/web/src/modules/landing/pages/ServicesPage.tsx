import { ServiceCard } from '../components/ServiceCard';
import { SiteLayout } from '../components/SiteLayout';
import { SitePageHero } from '../components/SitePageHero';
import { usePublicServices } from '@modules/services';
import '../styles/landing.css';

export function ServicesPage() {
  const { services, loading, error, refetch } = usePublicServices();

  return (
    <SiteLayout>
      <SitePageHero
        eyebrow="Nossos serviços"
        title="Serviços"
        description="Cuidado completo para o seu pet — da consulta de rotina à cirurgia e estética. Escolha o serviço e agende com facilidade."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" aria-label="Lista de serviços">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[28rem] animate-pulse rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
              />
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-12 text-center">
            <p className="font-display text-xl font-semibold text-[var(--color-fg)]">
              Não foi possível carregar os serviços
            </p>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-5 text-sm font-semibold text-[var(--color-primary-fg)] hover:bg-[var(--color-brand-700)]"
            >
              Tentar novamente
            </button>
          </div>
        ) : null}

        {!loading && !error && services.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-[var(--color-fg)]">
              Nenhum serviço disponível no momento
            </p>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Em breve publicaremos nossa lista completa de serviços.
            </p>
          </div>
        ) : null}

        {!loading && !error && services.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <li key={service.id}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </SiteLayout>
  );
}
