import { useMemo, useState } from 'react';
import {
  APPOINTMENT_STATUS_FILTERS,
  type AppointmentStatus,
} from '@central-pet/shared';
import { Button } from '@central-pet/ui';
import { AppointmentsCalendar } from '@modules/appointments/components/AppointmentsCalendar';
import { AppointmentsTable } from '@modules/appointments/components/AppointmentsTable';
import { useTenantAppointments } from '@modules/appointments';

type ViewMode = 'list' | 'calendar';

export function AdminAppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<'ALL' | AppointmentStatus>('ALL');
  const [view, setView] = useState<ViewMode>('list');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const now = new Date();
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-'),
  );

  const apiStatus = statusFilter === 'ALL' ? undefined : statusFilter;
  const { appointments, loading, error, refetch, updateStatus } =
    useTenantAppointments(apiStatus);

  const sorted = useMemo(
    () =>
      [...appointments].sort((a, b) => {
        const dateCmp = a.desired_date.localeCompare(b.desired_date);
        if (dateCmp !== 0) return dateCmp;
        return a.desired_time.localeCompare(b.desired_time);
      }),
    [appointments],
  );

  async function runAction(id: string, status: AppointmentStatus) {
    setActionError(null);
    setBusyId(id);
    try {
      await updateStatus(id, status);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível atualizar o status');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
            Operação
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)]">
            Agendamentos
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            Pedidos realizados pelo site. Confirme, cancele ou finalize cada atendimento.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={view === 'list' ? 'primary' : 'secondary'}
            onClick={() => setView('list')}
          >
            Lista
          </Button>
          <Button
            type="button"
            size="sm"
            variant={view === 'calendar' ? 'primary' : 'secondary'}
            onClick={() => setView('calendar')}
          >
            Calendário
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => void refetch()}>
            Atualizar
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
        {APPOINTMENT_STATUS_FILTERS.map((item) => {
          const active = statusFilter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setStatusFilter(item.value)}
              className={`h-9 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-[var(--color-brand-600)] text-[var(--color-primary-fg)]'
                  : 'border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] hover:border-[var(--color-brand-400)] hover:text-[var(--color-fg)]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {actionError ? (
        <p className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {actionError}
        </p>
      ) : null}

      {loading ? (
        <div className="h-64 animate-pulse rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]" />
      ) : null}

      {!loading && error ? (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold text-[var(--color-fg)]">
            Não foi possível carregar os agendamentos
          </p>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{error}</p>
          <Button type="button" className="mt-6" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {!loading && !error && view === 'list' ? (
        <AppointmentsTable
          appointments={sorted}
          busyId={busyId}
          onConfirm={(id) => void runAction(id, 'CONFIRMADO')}
          onCancel={(id) => void runAction(id, 'CANCELADO')}
          onFinalize={(id) => void runAction(id, 'CONCLUIDO')}
        />
      ) : null}

      {!loading && !error && view === 'calendar' ? (
        <div className="space-y-6">
          <AppointmentsCalendar
            year={calendarYear}
            monthIndex={calendarMonth}
            selectedDate={selectedDate}
            appointments={sorted}
            onMonthChange={(y, m) => {
              setCalendarYear(y);
              setCalendarMonth(m);
            }}
            onSelectDate={setSelectedDate}
          />
          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-[var(--color-fg)]">
              Ações do dia selecionado
            </h2>
            <AppointmentsTable
              appointments={
                selectedDate
                  ? sorted.filter((item) => item.desired_date.slice(0, 10) === selectedDate)
                  : []
              }
              busyId={busyId}
              onConfirm={(id) => void runAction(id, 'CONFIRMADO')}
              onCancel={(id) => void runAction(id, 'CANCELADO')}
              onFinalize={(id) => void runAction(id, 'CONCLUIDO')}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
