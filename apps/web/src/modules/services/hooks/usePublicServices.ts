import { useEffect, useState } from 'react';
import type { ServiceCatalogItem } from '@central-pet/shared';
import { PUBLIC_CLINIC_SLUG } from '@/config/public';
import { servicesApi } from '../api';

type UsePublicServicesState = {
  services: ServiceCatalogItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function usePublicServices(tenantSlug = PUBLIC_CLINIC_SLUG): UsePublicServicesState {
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await servicesApi.listPublic(tenantSlug);
        if (!cancelled) {
          setServices(response.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar os serviços');
          setServices([]);
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
    services,
    loading,
    error,
    refetch: () => setReloadKey((value) => value + 1),
  };
}
