import type {
  CreateFinanceTransactionInput,
  FinanceSummary,
  FinanceTransaction,
  FinanceTransactionList,
  FinanceType,
} from '@central-pet/shared';
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

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  const access = tokenStorage.getAccessToken();
  if (access) headers.set('Authorization', `Bearer ${access}`);
  const session = tokenStorage.getSession();
  if (session?.tenant_id) headers.set('X-Tenant-Id', session.tenant_id);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const financeApi = {
  getSummary() {
    return request<FinanceSummary>('/finance/summary', { method: 'GET' });
  },

  listTransactions(type?: FinanceType) {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return request<FinanceTransactionList>(`/finance/transactions${query}`, { method: 'GET' });
  },

  createTransaction(input: CreateFinanceTransactionInput) {
    return request<FinanceTransaction>('/finance/transactions', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  deleteTransaction(id: string) {
    return request<void>(`/finance/transactions/${id}`, { method: 'DELETE' });
  },
};

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

export function reaisToCents(value: string): number {
  const normalized = value.replace(/\./g, '').replace(',', '.').trim();
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
}
