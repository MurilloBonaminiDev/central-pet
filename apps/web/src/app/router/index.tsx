import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './paths';
import { adminRoutes } from './routes/admin.routes';
import { authRoutes } from './routes/auth.routes';
import { clienteRoutes } from './routes/cliente.routes';
import { legacyRoutes } from './routes/legacy.routes';
import { publicRoutes } from './routes/public.routes';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes}
        {authRoutes}
        {clienteRoutes}
        {adminRoutes}
        {legacyRoutes}

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export { ROUTES } from './paths';
