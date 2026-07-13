import '../styles/landing.css';
import { ContactDetails, ContactMap } from '../components/ContactInfo';
import { ContactHours } from '../components/ContactHours';
import { SiteLayout } from '../components/SiteLayout';
import { SitePageHero } from '../components/SitePageHero';

export function ContactPage() {
  return (
    <SiteLayout>
      <SitePageHero
        eyebrow="Contato"
        title="Fale conosco"
        description="Estamos prontos para atender você e seu pet. Entre em contato por telefone, WhatsApp ou visite nossa clínica."
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ContactDetails />
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ContactHours />
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
              Localização
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
              Como chegar
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[var(--color-fg-muted)]">
              Estamos na região central de São Paulo, com fácil acesso e estacionamento
              conveniado nas proximidades.
            </p>
          </div>
          <ContactMap />
        </div>
      </section>
    </SiteLayout>
  );
}
