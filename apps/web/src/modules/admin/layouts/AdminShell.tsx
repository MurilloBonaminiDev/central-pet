import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button, Navbar, Sidebar } from '@central-pet/ui';
import { ROUTES } from '@app/router/paths';
import { ROLE_LABELS, useAuth } from '@modules/auth';
import '@modules/dashboard/styles/dashboard.css';

function IconHome() {
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

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconFinance() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5M4 19h16M8 15v4M12 11v8M16 8v11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClients() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M19.5 19a4.5 4.5 0 0 0-3.2-4.3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function AdminShell() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onDashboard =
    location.pathname === ROUTES.admin.dashboard || location.pathname === ROUTES.admin.root;
  const onAppointments = location.pathname.startsWith(ROUTES.admin.agendamentos);
  const onFinance = location.pathname.startsWith(ROUTES.admin.financeiro);
  const onClients = location.pathname.startsWith(ROUTES.admin.clientes);

  const pageTitle = onAppointments
    ? 'Agendamentos'
    : onFinance
      ? 'Financeiro'
      : onClients
        ? 'Clientes'
        : 'Dashboard';

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar
          brand={
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold tracking-tight">Central Pet</p>
              <p className="text-xs text-[var(--color-sidebar-muted)]">Área administrativa</p>
            </div>
          }
          items={[
            {
              id: 'dashboard',
              label: 'Dashboard',
              href: ROUTES.admin.dashboard,
              active: onDashboard,
              icon: <IconHome />,
            },
            {
              id: 'agendamentos',
              label: 'Agendamentos',
              href: ROUTES.admin.agendamentos,
              active: onAppointments,
              icon: <IconCalendar />,
            },
            {
              id: 'clientes',
              label: 'Clientes',
              href: ROUTES.admin.clientes,
              active: onClients,
              icon: <IconClients />,
            },
            {
              id: 'financeiro',
              label: 'Financeiro',
              href: ROUTES.admin.financeiro,
              active: onFinance,
              icon: <IconFinance />,
            },
          ]}
          linkComponent={({ href, children: linkChildren, className }) => (
            <Link to={href} className={className}>
              {linkChildren}
            </Link>
          )}
          footer={
            session ? (
              <div className="space-y-1">
                <p className="truncate font-medium text-[var(--color-sidebar-fg)]">
                  {session.full_name}
                </p>
                <p className="truncate text-xs">{session.tenant_name}</p>
                <p className="truncate text-xs">{ROLE_LABELS[session.role]}</p>
              </div>
            ) : null
          }
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          title={pageTitle}
          subtitle={
            session ? `${session.tenant_name} · ${ROLE_LABELS[session.role]}` : 'Área administrativa'
          }
          showThemeToggle
          trailing={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                void logout().then(() => navigate(ROUTES.admin.login, { replace: true }));
              }}
            >
              Sair
            </Button>
          }
        />
        <main className="relative flex-1 overflow-auto">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 75% 50% at 0% -10%, color-mix(in srgb, var(--color-brand-400) 20%, transparent), transparent 55%), radial-gradient(ellipse 60% 45% at 100% 0%, color-mix(in srgb, var(--color-accent-400) 16%, transparent), transparent 50%), radial-gradient(ellipse 50% 40% at 50% 100%, color-mix(in srgb, var(--color-brand-600) 8%, transparent), transparent 60%)',
            }}
          />
          <div className="relative mx-auto max-w-[1680px] p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
