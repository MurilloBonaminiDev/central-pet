import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  AccessDeniedPage,
  ForgotPasswordPage,
  GuestRoute,
  LoginPage,
  ProtectedRoute,
  ResetPasswordPage,
} from '@modules/auth';
import { DashboardPage } from '@modules/dashboard';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/acesso-negado" element={<AccessDeniedPage />} />
          <Route path="/sessao" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
