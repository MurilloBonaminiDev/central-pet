import { useCallback, useEffect, useState } from 'react';
import type { ClientListItem } from '@central-pet/shared';
import { clientsApi } from '../api';

export function useClients(search: string) {
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsApi.list(search || undefined);
      setClients(data.items);
    } catch (err) {
      setClients([]);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os clientes');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { clients, loading, error, refetch };
}
