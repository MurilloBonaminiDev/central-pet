import { useCallback, useEffect, useState } from 'react';
import type { ClientDetail } from '@central-pet/shared';
import { clientsApi } from '../api';

export function useClientDetail(clientId: string | null) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!clientId) {
      setClient(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await clientsApi.get(clientId);
      setClient(data);
    } catch (err) {
      setClient(null);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o cliente');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { client, loading, error, refetch };
}
