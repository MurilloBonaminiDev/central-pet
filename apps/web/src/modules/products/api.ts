import type {
  CreateProductInput,
  ProductCatalogItem,
  ProductListResponse,
  UpdateProductInput,
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

export const productsApi = {
  listPublic(tenantSlug: string, category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request<ProductListResponse>(
      `/products/public/${encodeURIComponent(tenantSlug)}${query}`,
      { method: 'GET', skipAuth: true },
    );
  },

  list(includeInactive = false, category?: string) {
    const params = new URLSearchParams();
    if (includeInactive) params.set('include_inactive', 'true');
    if (category) params.set('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<ProductListResponse>(`/products${query}`, { method: 'GET' });
  },

  create(input: CreateProductInput) {
    return request<ProductCatalogItem>('/products', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  update(productId: string, input: UpdateProductInput) {
    return request<ProductCatalogItem>(`/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  remove(productId: string) {
    return request<void>(`/products/${productId}`, { method: 'DELETE' });
  },
};
