import { useEffect, useState } from 'react';
import type { ProductCatalogItem } from '@central-pet/shared';
import { PUBLIC_CLINIC_SLUG } from '@/config/public';
import { productsApi } from '../api';

type UsePublicProductsState = {
  products: ProductCatalogItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function usePublicProducts(tenantSlug = PUBLIC_CLINIC_SLUG): UsePublicProductsState {
  const [products, setProducts] = useState<ProductCatalogItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await productsApi.listPublic(tenantSlug);
        if (!cancelled) {
          setProducts(response.items);
          setCategories(response.categories);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar os produtos');
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [tenantSlug, reloadKey]);

  return {
    products,
    categories,
    loading,
    error,
    refetch: () => setReloadKey((value) => value + 1),
  };
}
