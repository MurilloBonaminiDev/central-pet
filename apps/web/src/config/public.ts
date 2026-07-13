/** Public clinic identifier used to resolve catalog data from the API. */
export const PUBLIC_CLINIC_SLUG =
  import.meta.env.VITE_TENANT_SLUG?.trim() || 'clinica-demo';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8000/api/v1';
