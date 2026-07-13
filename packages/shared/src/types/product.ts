/** Catalog product contract shared between API and frontend. */
export type ProductCategory =
  | 'Rações'
  | 'Medicamentos'
  | 'Brinquedos'
  | 'Acessórios'
  | 'Higiene';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Rações',
  'Medicamentos',
  'Brinquedos',
  'Acessórios',
  'Higiene',
];

export type ProductCatalogItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  image_alt: string;
  price_cents: number;
  sort_order: number;
  is_active: boolean;
};

export type ProductListResponse = {
  items: ProductCatalogItem[];
  categories: string[];
};

export type CreateProductInput = {
  name: string;
  description: string;
  category: string;
  image_url: string;
  image_alt: string;
  price_cents: number;
  slug?: string | null;
  sort_order?: number;
  is_active?: boolean;
};

export type UpdateProductInput = Partial<CreateProductInput>;
