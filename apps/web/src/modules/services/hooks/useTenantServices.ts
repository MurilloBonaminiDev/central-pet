import { useCallback, useEffect, useState } from 'react';
import type { ServiceCatalogItem } from '@central-pet/shared';
import { servicesApi } from '../api';

type UseTenantServicesState = {
  services: ServiceCatalogItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (input: Parameters<typeof servicesApi.create>[0]) => Promise<ServiceCatalogItem>;
  update: (
    serviceId: string,
    input: Parameters<typeof servicesApi.update>[1],
  ) => Promise<ServiceCatalogItem>;
  remove: (serviceId: string) => Promise<void>;
};

/** Hook for staff dashboard — requires authenticated session with tenant context. */
export function useTenantServices(includeInactive = true): UseTenantServicesState {
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await servicesApi.list(includeInactive);
      setServices(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os serviços');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const create = useCallback(
    async (input: Parameters<typeof servicesApi.create>[0]) => {
      const created = await servicesApi.create(input);
      await refetch();
      return created;
    },
    [refetch],
  );

  const update = useCallback(
    async (serviceId: string, input: Parameters<typeof servicesApi.update>[1]) => {
      const updated = await servicesApi.update(serviceId, input);
      await refetch();
      return updated;
    },
    [refetch],
  );

  const remove = useCallback(
    async (serviceId: string) => {
      await servicesApi.remove(serviceId);
      await refetch();
    },
    [refetch],
  );

  return {
    services,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
}
