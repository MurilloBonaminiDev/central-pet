/** Clients / pets / clinical history types from API. */

export type PetSpecies = 'Cão' | 'Gato' | 'Ave' | 'Outro';

export type ClientHistoryType = 'CONSULTA' | 'SERVICO' | 'VACINA' | 'OBSERVACAO';

export type PetItem = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age_years: number | null;
  created_at: string;
};

export type ClientHistoryItem = {
  id: string;
  entry_type: ClientHistoryType | string;
  entry_type_label: string;
  title: string;
  description: string | null;
  occurred_on: string;
  pet_id: string | null;
  pet_name: string | null;
  appointment_id: string | null;
  created_at: string;
};

export type ClientListItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  pets_count: number;
  created_at: string;
};

export type ClientListResponse = {
  items: ClientListItem[];
};

export type ClientDetail = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string | null;
  pets: PetItem[];
  history: ClientHistoryItem[];
  created_at: string;
};

export type CreateClientInput = {
  name: string;
  phone: string;
  email: string;
  notes?: string | null;
};

export type CreatePetInput = {
  name: string;
  species: string;
  breed?: string;
  age_years?: number | null;
};

export type CreateHistoryInput = {
  entry_type: ClientHistoryType;
  title: string;
  description?: string | null;
  occurred_on: string;
  pet_id?: string | null;
};

export type ImportClientsResult = {
  clients_created: number;
  pets_created: number;
  history_created: number;
};

export const CLIENT_HISTORY_TYPES: { value: ClientHistoryType; label: string }[] = [
  { value: 'CONSULTA', label: 'Consultas' },
  { value: 'SERVICO', label: 'Serviços realizados' },
  { value: 'VACINA', label: 'Vacinas' },
  { value: 'OBSERVACAO', label: 'Observações' },
];
