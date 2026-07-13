/** Catalog service contract shared between API and frontend. */
export type ServiceCatalogItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  image_alt: string;
  price_cents: number | null;
  duration_minutes: number;
  sort_order: number;
  is_active: boolean;
};

export type ServiceListResponse = {
  items: ServiceCatalogItem[];
};

export type CreateServiceInput = {
  name: string;
  description: string;
  image_url: string;
  image_alt: string;
  price_cents: number | null;
  duration_minutes: number;
  slug?: string | null;
  sort_order?: number;
  is_active?: boolean;
};

export type UpdateServiceInput = Partial<CreateServiceInput> & {
  clear_price?: boolean;
};
