import { Route } from 'react-router-dom';
import {
  CadastroPage,
  ForgotPasswordPage,
  GuestRoute,
  LoginPage,
  ResetPasswordPage,
} from '@modules/auth';
import { ROUTES } from '../paths';

export const authRoutes = (
  <>
    <Route element={<GuestRoute />}>
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.cadastro} element={<CadastroPage />} />
    </Route>

    <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
    <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
  </>
);
