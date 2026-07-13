import { CLINIC } from '../data/clinic';

export function HomeMap() {
  const mapSrc = `https://maps.google.com/maps?q=${CLINIC.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="mapa"
      className="scroll-mt-20 border-t border-[var(--color-border)] bg-[var(--color-bg)] py-20 sm:py-24"
      aria-labelledby="home-map-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
              Localização
            </p>
            <h2
              id="home-map-title"
              className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
            >
              Venha nos visitar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
              {CLINIC.address}
            </p>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-[var(--color-fg)]">Telefone</dt>
                <dd className="mt-1 text-[var(--color-fg-muted)]">{CLINIC.phoneDisplay}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--color-fg)]">E-mail</dt>
                <dd className="mt-1 text-[var(--color-fg-muted)]">{CLINIC.email}</dd>
              </div>
            </dl>
          </div>

          <div className="home-map-frame overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-md)]">
            <iframe
              title="Mapa da Central Pet"
              src={mapSrc}
              className="h-[22rem] w-full border-0 sm:h-[26rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
