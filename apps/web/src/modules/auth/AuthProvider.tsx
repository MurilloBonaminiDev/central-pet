import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { authApi } from './api';
import { tokenStorage } from './storage';
import type { AuthSession, TenantOption, TenantRole } from './types';

export type LoginOutcome = 'authenticated' | 'tenant_selection';

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  pendingTenants: TenantOption[];
  login: (email: string, password: string, tenantId?: string) => Promise<LoginOutcome>;
  register: (input: {
    clinicName: string;
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (...roles: TenantRole[]) => boolean;
  clearPendingTenants: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [pendingTenants, setPendingTenants] = useState<TenantOption[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      const stored = tokenStorage.getSession();
      const access = tokenStorage.getAccessToken();
      if (!stored || !access) {
        if (active) {
          setSession(null);
          setIsBootstrapping(false);
        }
        return;
      }
      try {
        const me = await authApi.me();
        if (active) setSession(me);
      } catch {
        tokenStorage.clear();
        if (active) setSession(null);
      } finally {
        if (active) setIsBootstrapping(false);
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string, tenantId?: string) => {
    const result = await authApi.login(email, password, tenantId);
    if (result.requires_tenant_selection) {
      setPendingTenants(result.tenants);
      return 'tenant_selection' as const;
    }
    if (!result.tokens || !result.session) {
      throw new Error('Resposta de login inválida');
    }
    tokenStorage.setSession(result.tokens, result.session);
    setSession(result.session);
    setPendingTenants([]);
    return 'authenticated' as const;
  }, []);

  const register = useCallback(
    async (input: {
      clinicName: string;
      fullName: string;
      email: string;
      password: string;
    }) => {
      const result = await authApi.register(input);
      if (!result.tokens || !result.session) {
        throw new Error('Resposta de cadastro inválida');
      }
      tokenStorage.setSession(result.tokens, result.session);
      setSession(result.session);
      setPendingTenants([]);
    },
    [],
  );

  const logout = useCallback(async () => {
    const refresh = tokenStorage.getRefreshToken();
    try {
      if (tokenStorage.getAccessToken()) {
        await authApi.logout(refresh);
      }
    } catch {
      /* ignore network errors on logout */
    } finally {
      tokenStorage.clear();
      setSession(null);
      setPendingTenants([]);
    }
  }, []);

  const hasRole = useCallback(
    (...roles: TenantRole[]) => {
      if (!session) return false;
      return roles.includes(session.role);
    },
    [session],
  );

  const clearPendingTenants = useCallback(() => {
    setPendingTenants([]);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isBootstrapping,
      pendingTenants,
      login,
      register,
      logout,
      hasRole,
      clearPendingTenants,
    }),
    [session, isBootstrapping, pendingTenants, login, register, logout, hasRole, clearPendingTenants],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
