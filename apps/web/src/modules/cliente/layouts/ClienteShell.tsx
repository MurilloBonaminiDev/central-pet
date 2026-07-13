import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button, Navbar, Sidebar } from '@central-pet/ui';
import { ROUTES } from '@app/router/paths';

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPets() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function IconAgenda() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconVacinas() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCompras() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 7h15l-1.5 9H8L6 7Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M6 7l-1-3H2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1.25" fill="currentColor" />
      <circle cx="17" cy="20" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IconPerfil() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5 20a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: ROUTES.cliente.dashboard, icon: <IconDashboard /> },
  { id: 'pets', label: 'Meus Pets', href: ROUTES.cliente.pets, icon: <IconPets /> },
  {
    id: 'agendamentos',
    label: 'Agendamentos',
    href: ROUTES.cliente.agendamentos,
    icon: <IconAgenda />,
  },
  { id: 'vacinas', label: 'Vacinas', href: ROUTES.cliente.vacinas, icon: <IconVacinas /> },
  { id: 'compras', label: 'Compras', href: ROUTES.cliente.compras, icon: <IconCompras /> },
  { id: 'perfil', label: 'Perfil', href: ROUTES.cliente.perfil, icon: <IconPerfil /> },
] as const;

function titleFromPath(pathname: string): string {
  const match = NAV_ITEMS.find((item) => item.href === pathname);
  return match?.label ?? 'Área do cliente';
}

export function ClienteShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = titleFromPath(pathname);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar
          brand={
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold tracking-tight">Central Pet</p>
              <p className="text-xs text-[var(--color-sidebar-muted)]">Área do cliente</p>
            </div>
          }
          items={NAV_ITEMS.map((item) => ({
            id: item.id,
            label: item.label,
            href: item.href,
            icon: item.icon,
            active: pathname === item.href,
          }))}
          linkComponent={({ href, children, className }) => (
            <NavLink to={href} className={className}>
              {children}
            </NavLink>
          )}
          footer={
            <div className="space-y-1">
              <p className="truncate font-medium text-[var(--color-sidebar-fg)]">Tutor</p>
              <p className="truncate text-xs text-[var(--color-sidebar-muted)]">
                Conta do cliente
              </p>
            </div>
          }
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          title={title}
          subtitle="Área do cliente"
          trailing={
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.home}
                className="hidden text-sm font-medium text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] sm:inline"
              >
                Site
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.login, { replace: true })}
              >
                Sair
              </Button>
            </div>
          }
        />

        <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto" aria-label="Menu do cliente">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.href}
                className={({ isActive }) =>
                  [
                    'whitespace-nowrap rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-[var(--color-brand-600)] text-[var(--color-primary-fg)]'
                      : 'bg-[var(--color-bg-muted)] text-[var(--color-fg-muted)]',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
