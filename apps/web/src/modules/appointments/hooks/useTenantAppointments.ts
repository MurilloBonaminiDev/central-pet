import { useCallback, useEffect, useState } from 'react';
import type { AppointmentItem } from '@central-pet/shared';
import { appointmentsApi } from '../api';

/** Hook for admin dashboard — requires authenticated tenant session. */
export function useTenantAppointments(status?: string) {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentsApi.list(status);
      setAppointments(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os agendamentos');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const updateStatus = useCallback(
    async (appointmentId: string, nextStatus: string) => {
      const updated = await appointmentsApi.updateStatus(appointmentId, nextStatus);
      await refetch();
      return updated;
    },
    [refetch],
  );

  return {
    appointments,
    loading,
    error,
    refetch,
    updateStatus,
  };
}
