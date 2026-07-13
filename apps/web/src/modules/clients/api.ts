import type {
  ClientDetail,
  ClientListResponse,
  CreateClientInput,
  CreateHistoryInput,
  CreatePetInput,
  ImportClientsResult,
  PetItem,
  ClientHistoryItem,
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

export const clientsApi = {
  list(q?: string) {
    const query = q?.trim() ? `?q=${encodeURIComponent(q.trim())}` : '';
    return request<ClientListResponse>(`/clients${query}`, { method: 'GET' });
  },

  get(id: string) {
    return request<ClientDetail>(`/clients/${id}`, { method: 'GET' });
  },

  create(input: CreateClientInput) {
    return request<ClientDetail>('/clients', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  update(id: string, input: Partial<CreateClientInput>) {
    return request<ClientDetail>(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  remove(id: string) {
    return request<void>(`/clients/${id}`, { method: 'DELETE' });
  },

  importFromAppointments() {
    return request<ImportClientsResult>('/clients/import-appointments', { method: 'POST' });
  },

  createPet(clientId: string, input: CreatePetInput) {
    return request<PetItem>(`/clients/${clientId}/pets`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  removePet(clientId: string, petId: string) {
    return request<void>(`/clients/${clientId}/pets/${petId}`, { method: 'DELETE' });
  },

  createHistory(clientId: string, input: CreateHistoryInput) {
    return request<ClientHistoryItem>(`/clients/${clientId}/history`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  removeHistory(clientId: string, historyId: string) {
    return request<void>(`/clients/${clientId}/history/${historyId}`, { method: 'DELETE' });
  },
};
