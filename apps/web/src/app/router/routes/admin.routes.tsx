import { Navigate, Route } from 'react-router-dom';
import { ADMIN_ROLES, ROUTES } from '../paths';
import {
  AdminAppointmentsPage,
  AdminClientsPage,
  AdminFinancePage,
  AdminLoginPage,
  AdminShell,
} from '@modules/admin';
import { GuestRoute, ProtectedRoute, type TenantRole } from '@modules/auth';
import { DashboardPage } from '@modules/dashboard';

const staffRoles = [...ADMIN_ROLES] as TenantRole[];

export const adminRoutes = (
  <>
    <Route element={<GuestRoute redirectTo={ROUTES.admin.dashboard} />}>
      <Route path={ROUTES.admin.login} element={<AdminLoginPage />} />
    </Route>

    <Route
      element={
        <ProtectedRoute roles={staffRoles} loginPath={ROUTES.admin.login} />
      }
    >
      <Route path={ROUTES.admin.root} element={<AdminShell />}>
        <Route index element={<Navigate to={ROUTES.admin.dashboard} replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="agendamentos" element={<AdminAppointmentsPage />} />
        <Route path="financeiro" element={<AdminFinancePage />} />
        <Route path="clientes" element={<AdminClientsPage />} />
      </Route>
    </Route>
  </>
);
