import { Navigate, Route } from 'react-router-dom';
import { ROUTES } from '../paths';

/** Redirects from paths used before route reorganization. */
export const legacyRoutes = (
  <>
    <Route path="/dashboard" element={<Navigate to={ROUTES.admin.dashboard} replace />} />
    <Route path="/criar-conta" element={<Navigate to={ROUTES.cadastro} replace />} />
  </>
);
