import type { AppointmentItem, AppointmentStatus } from '@central-pet/shared';
import { APPOINTMENT_STATUS_LABELS } from '@central-pet/shared';

export function formatAppointmentDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day));
}

export function formatAppointmentTime(time: string): string {
  return time.slice(0, 5);
}

export function appointmentStatusLabel(status: string): string {
  return APPOINTMENT_STATUS_LABELS[status as AppointmentStatus] ?? status;
}

export function appointmentStatusBadgeVariant(
  status: string,
): 'warning' | 'info' | 'success' | 'danger' | 'neutral' {
  switch (status) {
    case 'PENDENTE':
      return 'warning';
    case 'CONFIRMADO':
      return 'info';
    case 'CONCLUIDO':
      return 'success';
    case 'CANCELADO':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function groupAppointmentsByDate(
  appointments: AppointmentItem[],
): Record<string, AppointmentItem[]> {
  return appointments.reduce<Record<string, AppointmentItem[]>>((acc, item) => {
    const key = item.desired_date.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export type CalendarDay = {
  date: Date;
  iso: string;
  inMonth: boolean;
  isToday: boolean;
};

export function buildMonthGrid(year: number, monthIndex: number): CalendarDay[] {
  const first = new Date(year, monthIndex, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const start = new Date(year, monthIndex, 1 - startOffset);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const iso = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    days.push({
      date,
      iso,
      inMonth: date.getMonth() === monthIndex,
      isToday: normalized.getTime() === today.getTime(),
    });
  }
  return days;
}

export function monthTitle(year: number, monthIndex: number): string {
  const label = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, monthIndex, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}
