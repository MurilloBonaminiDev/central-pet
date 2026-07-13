import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/paths';
import { CLINIC, whatsappUrl } from '../data/clinic';
import { ClinicLogo } from './ClinicLogo';

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function HomeHero() {
  return (
    <section className="home-hero relative overflow-hidden" aria-labelledby="home-hero-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 60% at 0% 0%, color-mix(in srgb, var(--color-brand-400) 32%, transparent), transparent), radial-gradient(ellipse 70% 55% at 100% 100%, color-mix(in srgb, var(--color-accent-300) 26%, transparent), transparent), linear-gradient(165deg, var(--color-brand-950) 0%, var(--color-brand-800) 42%, var(--color-brand-700) 100%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        <div className="max-w-xl">
          <p className="landing-hero-title inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-100)] backdrop-blur-sm">
            {CLINIC.tagline}
          </p>

          <div className="landing-hero-title mt-6">
            <ClinicLogo size="lg" variant="light" showTagline={false} />
          </div>

          <h1
            id="home-hero-title"
            className="landing-hero-subtitle mt-6 text-xl font-semibold leading-snug text-white/95 sm:text-2xl"
          >
            {CLINIC.slogan}
          </h1>
          <p className="landing-hero-subtitle mt-4 max-w-lg text-base leading-relaxed text-[var(--color-brand-100)]/90 sm:text-lg">
            Consultas, vacinas, exames e bem-estar com equipe especializada e atendimento
            humanizado — do primeiro latido ao golden hour.
          </p>

          <div className="landing-hero-actions mt-9 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl('Olá! Gostaria de agendar uma consulta na Central Pet.')}
              target="_blank"
              rel="noopener noreferrer"
              className="home-btn-whatsapp inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[#25D366] px-5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
            >
              <IconWhatsApp />
              WhatsApp
            </a>
            <Link
              to={ROUTES.agendamento}
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-400)] px-5 text-sm font-semibold text-[var(--color-neutral-950)] shadow-lg transition-transform hover:scale-[1.02] hover:bg-[var(--color-accent-300)]"
            >
              Agendar Consulta
            </Link>
            <Link
              to={ROUTES.login}
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/18"
            >
              Área do Cliente
            </Link>
          </div>
        </div>

        <div className="landing-hero-visual relative">
          <div className="landing-hero-visual-inner home-hero-banner relative aspect-[5/4] overflow-hidden rounded-[var(--radius-2xl)] border border-white/15 shadow-[0_32px_64px_-16px_rgb(0_0_0_/_0.45)]">
            <img
              src={CLINIC.bannerImage}
              alt="Cão feliz recebendo carinho — Central Pet"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-950)]/90 via-[var(--color-brand-950)]/30 to-transparent"
            />
            <div className="relative z-[1] flex h-full flex-col justify-end p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Clínica veterinária completa
              </p>
              <p className="mt-2 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Saúde, conforto e carinho em cada visita.
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
                Estrutura completa para consultas, internação, estética e acompanhamento
                contínuo do seu pet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
