import type {
  CreateServiceInput,
  ServiceListResponse,
  ServiceCatalogItem,
  UpdateServiceInput,
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

async function request<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  if (!init.skipAuth) {
    const access = tokenStorage.getAccessToken();
    if (access) headers.set('Authorization', `Bearer ${access}`);
    const session = tokenStorage.getSession();
    if (session?.tenant_id) headers.set('X-Tenant-Id', session.tenant_id);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const servicesApi = {
  listPublic(tenantSlug: string) {
    return request<ServiceListResponse>(`/services/public/${encodeURIComponent(tenantSlug)}`, {
      method: 'GET',
      skipAuth: true,
    });
  },

  list(includeInactive = false) {
    const query = includeInactive ? '?include_inactive=true' : '';
    return request<ServiceListResponse>(`/services${query}`, { method: 'GET' });
  },

  create(input: CreateServiceInput) {
    return request<ServiceCatalogItem>('/services', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  update(serviceId: string, input: UpdateServiceInput) {
    return request<ServiceCatalogItem>(`/services/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  remove(serviceId: string) {
    return request<void>(`/services/${serviceId}`, { method: 'DELETE' });
  },
};
