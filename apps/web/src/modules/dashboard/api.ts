import type { DashboardStats } from '@central-pet/shared';
import { API_BASE_URL } from '@/config/public';
import { tokenStorage } from '@modules/auth/storage';

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
  return 'Falha na requisição';
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const access = tokenStorage.getAccessToken();
  if (access) headers.set('Authorization', `Bearer ${access}`);
  const session = tokenStorage.getSession();
  if (session?.tenant_id) headers.set('X-Tenant-Id', session.tenant_id);

  const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as DashboardStats;
}

export function formatBRLFromCents(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
