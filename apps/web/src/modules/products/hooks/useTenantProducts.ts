import { useCallback, useEffect, useState } from 'react';
import type { ProductCatalogItem } from '@central-pet/shared';
import { productsApi } from '../api';

/** Hook for staff dashboard — requires authenticated session with tenant context. */
export function useTenantProducts(includeInactive = true) {
  const [products, setProducts] = useState<ProductCatalogItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.list(includeInactive);
      setProducts(response.items);
      setCategories(response.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os produtos');
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const create = useCallback(
    async (input: Parameters<typeof productsApi.create>[0]) => {
      const created = await productsApi.create(input);
      await refetch();
      return created;
    },
    [refetch],
  );

  const update = useCallback(
    async (productId: string, input: Parameters<typeof productsApi.update>[1]) => {
      const updated = await productsApi.update(productId, input);
      await refetch();
      return updated;
    },
    [refetch],
  );

  const remove = useCallback(
    async (productId: string) => {
      await productsApi.remove(productId);
      await refetch();
    },
    [refetch],
  );

  return {
    products,
    categories,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
}
