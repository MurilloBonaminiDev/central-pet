import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/paths';
import { CLINIC } from '../data/clinic';

const NAV = [
  { label: 'Início', href: '#inicio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Horários', href: '#horarios' },
  { label: 'Localização', href: '#mapa' },
] as const;

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17" cy="8" r="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8 14c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5-2 5-4 5-4-3.5-4-5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)]/80 bg-[var(--color-bg)]/85 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6"
        aria-label="Principal"
      >
        <Link to={ROUTES.home} className="home-logo flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-brand-600)] text-[var(--color-fg-on-brand)] shadow-[var(--shadow-sm)]">
            <LogoMark />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-tight text-[var(--color-fg)]">
              {CLINIC.name}
            </span>
            <span className="hidden text-xs text-[var(--color-fg-muted)] sm:block">
              {CLINIC.tagline}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="home-nav-link text-sm font-medium text-[var(--color-fg-muted)]">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <Link
          to={ROUTES.login}
          className="hidden h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-4 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-brand-400)] sm:inline-flex"
        >
          Entrar
        </Link>
      </nav>
    </header>
  );
}
