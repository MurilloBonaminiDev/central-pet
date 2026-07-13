import type {
  AppointmentItem,
  AppointmentListResponse,
  CreateAppointmentInput,
  CreateAppointmentResult,
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

export const appointmentsApi = {
  createPublic(tenantSlug: string, input: CreateAppointmentInput) {
    return request<CreateAppointmentResult>(
      `/appointments/public/${encodeURIComponent(tenantSlug)}`,
      {
        method: 'POST',
        body: JSON.stringify(input),
        skipAuth: true,
      },
    );
  },

  list(status?: string) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<AppointmentListResponse>(`/appointments${query}`, { method: 'GET' });
  },

  updateStatus(appointmentId: string, status: string) {
    return request<AppointmentItem>(`/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
