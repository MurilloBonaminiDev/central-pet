export type TenantRole =
  | 'administrator'
  | 'veterinarian'
  | 'reception'
  | 'financial'
  | 'grooming';

export const ROLE_LABELS: Record<TenantRole, string> = {
  administrator: 'Administrador',
  veterinarian: 'Veterinário',
  reception: 'Recepção',
  financial: 'Financeiro',
  grooming: 'Banho e Tosa',
};

export type TenantOption = {
  id: string;
  name: string;
  slug: string;
  role: TenantRole;
};

export type AuthSession = {
  id: string;
  email: string;
  full_name: string;
  tenant_id: string;
  tenant_name: string;
  role: TenantRole;
};

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export type LoginResponse = {
  requires_tenant_selection: boolean;
  tenants: TenantOption[];
  tokens: TokenPair | null;
  session: AuthSession | null;
};
