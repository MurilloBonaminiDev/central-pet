import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@app/router/paths';
import { useAuth } from './AuthProvider';
import type { TenantRole } from './types';

type ProtectedRouteProps = {
  roles?: TenantRole[];
  /** Where to send unauthenticated users (default: public client login). */
  loginPath?: string;
};

export function ProtectedRoute({
  roles,
  loginPath = ROUTES.login,
}: ProtectedRouteProps) {
  const { isAuthenticated, isBootstrapping, hasRole } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg-muted)]">
        Carregando sessão...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
}

type GuestRouteProps = {
  /** Where authenticated users go instead of the guest page. */
  redirectTo?: string;
};

export function GuestRoute({ redirectTo = ROUTES.cliente.root }: GuestRouteProps) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] text-[var(--color-fg-muted)]">
        Carregando sessão...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
