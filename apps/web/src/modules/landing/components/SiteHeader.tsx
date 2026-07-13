import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '@app/router/paths';
import { ClinicLogo } from './ClinicLogo';

const NAV = [
  { label: 'Início', to: ROUTES.home },
  { label: 'Sobre', to: ROUTES.sobre },
  { label: 'Serviços', to: ROUTES.servicos },
  { label: 'Produtos', to: ROUTES.produtos },
  { label: 'Contato', to: ROUTES.contato },
] as const;

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)]/80 bg-[var(--color-bg)]/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Principal"
      >
        <Link to={ROUTES.home} className="home-logo shrink-0">
          <ClinicLogo size="md" />
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === ROUTES.home}
                className={({ isActive }) =>
                  [
                    'home-nav-link text-sm font-medium transition-colors',
                    isActive ? 'text-[var(--color-brand-700)]' : 'text-[var(--color-fg-muted)]',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.agendamento}
            className="hidden h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-4 text-sm font-semibold text-[var(--color-primary-fg)] transition-colors hover:bg-[var(--color-brand-700)] sm:inline-flex"
          >
            Agendar
          </Link>
          <Link
            to={ROUTES.login}
            className="hidden h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-4 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-brand-400)] md:inline-flex"
          >
            Entrar
          </Link>
        </div>
      </nav>
    </header>
  );
}
