/** Online appointment / booking request contract. */
export type AppointmentStatus = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  CONCLUIDO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

export const APPOINTMENT_STATUS_FILTERS: Array<{
  value: 'ALL' | AppointmentStatus;
  label: string;
}> = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'CONCLUIDO', label: 'Finalizado' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

export type AppointmentSource = 'WEB' | 'WHATSAPP' | 'ADMIN';

export const APPOINTMENT_SOURCE_LABELS: Record<AppointmentSource, string> = {
  WEB: 'Site',
  WHATSAPP: 'WhatsApp',
  ADMIN: 'Admin',
};

export type AppointmentItem = {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  pet_name: string;
  pet_species: string;
  service_id: string | null;
  service_name: string;
  desired_date: string;
  desired_time: string;
  notes: string | null;
  status: AppointmentStatus | string;
  source?: AppointmentSource | string;
  external_message_id?: string | null;
  created_at: string;
};

export type AppointmentListResponse = {
  items: AppointmentItem[];
};

export type CreateAppointmentInput = {
  client_name: string;
  client_phone: string;
  client_email: string;
  pet_name: string;
  pet_species: string;
  service_id?: string | null;
  service_name?: string | null;
  desired_date: string;
  desired_time: string;
  notes?: string | null;
};

export type CreateAppointmentResult = {
  appointment: AppointmentItem;
  message: string;
};

export const PET_SPECIES_OPTIONS = ['Cão', 'Gato', 'Ave', 'Outro'] as const;
