import type { PropsWithChildren, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Navbar, Sidebar } from '@central-pet/ui';
import { ROLE_LABELS, useAuth } from '@modules/auth';
import '../styles/dashboard.css';

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

type DashboardShellProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  trailing?: ReactNode;
}>;

export function DashboardShell({
  children,
  title = 'Dashboard',
  subtitle,
  trailing,
}: DashboardShellProps) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar
          brand={
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold tracking-tight">Central Pet</p>
              <p className="text-xs text-[var(--color-sidebar-muted)]">Operação clínica</p>
            </div>
          }
          items={[
            {
              id: 'dashboard',
              label: 'Dashboard',
              href: '/dashboard',
              active: true,
              icon: <IconHome />,
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
          title={title}
          subtitle={
            subtitle ??
            (session ? `${session.tenant_name} · ${ROLE_LABELS[session.role]}` : undefined)
          }
          showThemeToggle
          trailing={
            trailing ?? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  void logout().then(() => navigate('/login', { replace: true }));
                }}
              >
                Sair
              </Button>
            )
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
          <div className="relative mx-auto max-w-[1680px] p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
