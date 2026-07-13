import { tokenStorage } from './storage';
import type { AuthSession, LoginResponse, TenantOption, TokenPair } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

type ApiErrorBody = {
  detail?: string | Array<{ msg?: string }>;
};

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (typeof body.detail === 'string') return body.detail;
    if (Array.isArray(body.detail) && body.detail[0]?.msg) return body.detail[0].msg;
  } catch {
    /* ignore */
  }
  return 'Falha na requisição de autenticação';
}

async function request<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean; tenantId?: string } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  if (!init.skipAuth) {
    const access = tokenStorage.getAccessToken();
    if (access) headers.set('Authorization', `Bearer ${access}`);
    const session = tokenStorage.getSession();
    const tenantId = init.tenantId ?? session?.tenant_id;
    if (tenantId) headers.set('X-Tenant-Id', tenantId);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (response.status === 401 && !init.skipAuth && !path.includes('/auth/refresh')) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, init);
    }
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefreshToken();
  const session = tokenStorage.getSession();
  if (!refreshToken || !session) {
    tokenStorage.clear();
    return false;
  }

  try {
    const tokens = await request<TokenPair>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      skipAuth: true,
    });
    tokenStorage.setSession(tokens, session);
    return true;
  } catch {
    tokenStorage.clear();
    return false;
  }
}

export const authApi = {
  login(email: string, password: string, tenantId?: string) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, tenant_id: tenantId ?? null }),
      skipAuth: true,
    });
  },
  refresh(refreshToken: string) {
    return request<TokenPair>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      skipAuth: true,
    });
  },
  logout(refreshToken?: string | null) {
    return request<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken ?? null }),
    });
  },
  me() {
    return request<AuthSession>('/auth/me', { method: 'GET' });
  },
  forgotPassword(email: string) {
    return request<{ message: string; reset_token?: string | null }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },
  resetPassword(token: string, newPassword: string) {
    return request<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
      skipAuth: true,
    });
  },
  register(input: {
    clinicName: string;
    fullName: string;
    email: string;
    password: string;
  }) {
    return request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        clinic_name: input.clinicName,
        full_name: input.fullName,
        email: input.email,
        password: input.password,
      }),
      skipAuth: true,
    });
  },
  listRoles() {
    return request<{ roles: Array<{ id: string; label: string }> }>('/auth/roles', {
      method: 'GET',
      skipAuth: true,
    });
  },
};

export type { TenantOption };
