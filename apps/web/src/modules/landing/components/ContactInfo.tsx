import { CLINIC, whatsappUrl } from '../data/clinic';

export function ContactMap() {
  const mapSrc = `https://maps.google.com/maps?q=${CLINIC.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="home-map-frame overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-md)]">
      <iframe
        title="Mapa da Central Pet"
        src={mapSrc}
        className="h-[22rem] w-full border-0 sm:h-[26rem]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export function ContactDetails() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="home-glass-card rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-sm)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
          Telefone
        </p>
        <a
          href={`tel:+${CLINIC.phone}`}
          className="mt-2 block font-display text-xl font-semibold text-[var(--color-fg)] transition-colors hover:text-[var(--color-brand-700)]"
        >
          {CLINIC.phoneDisplay}
        </a>
      </div>

      <div className="home-glass-card rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-sm)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
          WhatsApp
        </p>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 font-display text-xl font-semibold text-[#128C7E] transition-colors hover:text-[#075E54]"
        >
          {CLINIC.phoneDisplay}
        </a>
      </div>

      <div className="home-glass-card rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-sm)] sm:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
          Endereço
        </p>
        <p className="mt-2 text-base leading-relaxed text-[var(--color-fg)]">{CLINIC.fullAddress}</p>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{CLINIC.email}</p>
      </div>
    </div>
  );
}
