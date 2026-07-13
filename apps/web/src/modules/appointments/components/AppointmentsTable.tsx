import type { AppointmentItem, AppointmentSource } from '@central-pet/shared';
import { APPOINTMENT_SOURCE_LABELS } from '@central-pet/shared';
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@central-pet/ui';
import {
  appointmentStatusBadgeVariant,
  appointmentStatusLabel,
  formatAppointmentDate,
  formatAppointmentTime,
} from '../format';

type Props = {
  appointments: AppointmentItem[];
  busyId: string | null;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onFinalize: (id: string) => void;
};

function sourceLabel(source?: string) {
  if (!source) return APPOINTMENT_SOURCE_LABELS.WEB;
  return APPOINTMENT_SOURCE_LABELS[source as AppointmentSource] ?? source;
}

export function AppointmentsTable({
  appointments,
  busyId,
  onConfirm,
  onCancel,
  onFinalize,
}: Props) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-14 text-center">
        <p className="font-display text-lg font-semibold text-[var(--color-fg)]">
          Nenhum agendamento encontrado
        </p>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Pedidos do site (e, no futuro, do WhatsApp) aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Pet</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Canal</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Horário</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((item) => {
          const busy = busyId === item.id;
          const canConfirm = item.status === 'PENDENTE';
          const canFinalize = item.status === 'PENDENTE' || item.status === 'CONFIRMADO';
          const canCancel = item.status === 'PENDENTE' || item.status === 'CONFIRMADO';

          return (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{item.client_name}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">{item.client_email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{item.pet_name}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">{item.pet_species}</p>
                </div>
              </TableCell>
              <TableCell>{item.service_name}</TableCell>
              <TableCell>
                <Badge variant={item.source === 'WHATSAPP' ? 'success' : 'neutral'}>
                  {sourceLabel(item.source)}
                </Badge>
              </TableCell>
              <TableCell>{formatAppointmentDate(item.desired_date)}</TableCell>
              <TableCell>{formatAppointmentTime(item.desired_time)}</TableCell>
              <TableCell>
                <a
                  href={`tel:${item.client_phone}`}
                  className="text-[var(--color-brand-700)] hover:underline"
                >
                  {item.client_phone}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={appointmentStatusBadgeVariant(item.status)}>
                  {appointmentStatusLabel(item.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {canConfirm ? (
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy}
                      onClick={() => onConfirm(item.id)}
                    >
                      Confirmar
                    </Button>
                  ) : null}
                  {canFinalize ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={busy}
                      onClick={() => onFinalize(item.id)}
                    >
                      Finalizar
                    </Button>
                  ) : null}
                  {canCancel ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      disabled={busy}
                      onClick={() => onCancel(item.id)}
                    >
                      Cancelar
                    </Button>
                  ) : null}
                  {!canConfirm && !canFinalize && !canCancel ? (
                    <span className="text-xs text-[var(--color-fg-muted)]">—</span>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
