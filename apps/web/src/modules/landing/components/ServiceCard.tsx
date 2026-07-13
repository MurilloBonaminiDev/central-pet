import { Link } from 'react-router-dom';
import type { ServiceCatalogItem } from '@central-pet/shared';
import { ROUTES } from '@app/router/paths';
import { CLINIC } from '../data/clinic';
import { formatServiceDuration, formatServicePrice } from '@modules/services';

function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

type ServiceCardProps = {
  service: ServiceCatalogItem;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const whatsappUrl = `https://wa.me/${CLINIC.phone}?text=${encodeURIComponent(
    `Olá! Gostaria de saber mais sobre o serviço de ${service.name} na Central Pet.`,
  )}`;

  return (
    <article className="service-card flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-muted)]">
        <img
          src={service.image_url}
          alt={service.image_alt}
          className="service-card-image h-full w-full object-cover"
          loading="lazy"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-brand-950)]/35 to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold text-[var(--color-fg)]">
          {service.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          {service.description}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
              Valor
            </dt>
            <dd className="mt-0.5 font-semibold text-[var(--color-brand-700)]">
              {formatServicePrice(service.price_cents)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-subtle)]">
              Duração
            </dt>
            <dd className="mt-0.5 font-medium text-[var(--color-fg)]">
              {formatServiceDuration(service.duration_minutes)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to={ROUTES.agendamento}
            className="inline-flex h-10 min-w-[7.5rem] flex-1 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-4 text-sm font-semibold text-[var(--color-primary-fg)] transition-colors hover:bg-[var(--color-brand-700)]"
          >
            Agendar
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 min-w-[7.5rem] flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[#25D366] px-4 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            <IconWhatsApp />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
