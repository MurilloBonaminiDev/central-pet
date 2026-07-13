import { Navigate, Route } from 'react-router-dom';
import { AccessDeniedPage } from '@modules/auth';
import {
  AgendamentosPage,
  ClienteDashboardPage,
  ClienteShell,
  ComprasPage,
  MeusPetsPage,
  PerfilPage,
  VacinasPage,
} from '@modules/cliente';
import { ROUTES } from '../paths';

export const clienteRoutes = (
  <>
    <Route path={ROUTES.cliente.root} element={<ClienteShell />}>
      <Route index element={<Navigate to={ROUTES.cliente.dashboard} replace />} />
      <Route path="dashboard" element={<ClienteDashboardPage />} />
      <Route path="pets" element={<MeusPetsPage />} />
      <Route path="agendamentos" element={<AgendamentosPage />} />
      <Route path="vacinas" element={<VacinasPage />} />
      <Route path="compras" element={<ComprasPage />} />
      <Route path="perfil" element={<PerfilPage />} />
    </Route>

    <Route path="/acesso-negado" element={<AccessDeniedPage />} />
    <Route path="/sessao" element={<Navigate to={ROUTES.cliente.dashboard} replace />} />
  </>
);
