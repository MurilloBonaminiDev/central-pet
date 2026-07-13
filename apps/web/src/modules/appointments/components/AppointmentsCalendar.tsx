import type { AppointmentItem } from '@central-pet/shared';
import { Badge, Button } from '@central-pet/ui';
import {
  appointmentStatusBadgeVariant,
  appointmentStatusLabel,
  buildMonthGrid,
  formatAppointmentTime,
  groupAppointmentsByDate,
  monthTitle,
} from '../format';

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const;

type Props = {
  year: number;
  monthIndex: number;
  selectedDate: string | null;
  appointments: AppointmentItem[];
  onMonthChange: (year: number, monthIndex: number) => void;
  onSelectDate: (iso: string) => void;
};

export function AppointmentsCalendar({
  year,
  monthIndex,
  selectedDate,
  appointments,
  onMonthChange,
  onSelectDate,
}: Props) {
  const days = buildMonthGrid(year, monthIndex);
  const byDate = groupAppointmentsByDate(appointments);

  function goPrev() {
    if (monthIndex === 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, monthIndex - 1);
  }

  function goNext() {
    if (monthIndex === 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, monthIndex + 1);
  }

  const selectedItems = selectedDate ? byDate[selectedDate] ?? [] : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
        <header className="mb-4 flex items-center justify-between gap-3">
          <Button type="button" size="sm" variant="secondary" onClick={goPrev}>
            Anterior
          </Button>
          <h3 className="font-display text-lg font-semibold text-[var(--color-fg)] sm:text-xl">
            {monthTitle(year, monthIndex)}
          </h3>
          <Button type="button" size="sm" variant="secondary" onClick={goNext}>
            Próximo
          </Button>
        </header>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-[var(--color-fg-muted)]">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const items = byDate[day.iso] ?? [];
            const selected = selectedDate === day.iso;
            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => onSelectDate(day.iso)}
                className={[
                  'min-h-[4.5rem] rounded-[var(--radius-md)] border p-1.5 text-left transition-colors',
                  day.inMonth
                    ? 'border-[var(--color-border)] bg-[var(--color-bg)]'
                    : 'border-transparent bg-transparent opacity-45',
                  day.isToday ? 'ring-2 ring-[var(--color-brand-400)]' : '',
                  selected
                    ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-50)]'
                    : 'hover:border-[var(--color-brand-300)]',
                ].join(' ')}
              >
                <span
                  className={[
                    'text-sm font-semibold',
                    day.inMonth ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]',
                  ].join(' ')}
                >
                  {day.date.getDate()}
                </span>
                {items.length > 0 ? (
                  <div className="mt-1 space-y-0.5">
                    <span className="inline-flex rounded-full bg-[var(--color-brand-600)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-primary-fg)]">
                      {items.length}
                    </span>
                    <p className="truncate text-[10px] text-[var(--color-fg-muted)]">
                      {formatAppointmentTime(items[0].desired_time)} {items[0].pet_name}
                    </p>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)]">
        <h3 className="font-display text-lg font-semibold text-[var(--color-fg)]">
          {selectedDate
            ? `Agendamentos · ${new Intl.DateTimeFormat('pt-BR').format(
                new Date(
                  Number(selectedDate.slice(0, 4)),
                  Number(selectedDate.slice(5, 7)) - 1,
                  Number(selectedDate.slice(8, 10)),
                ),
              )}`
            : 'Selecione um dia'}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          Clique em um dia no calendário para ver os detalhes.
        </p>

        {selectedDate && selectedItems.length === 0 ? (
          <p className="mt-8 text-sm text-[var(--color-fg-muted)]">
            Nenhum agendamento neste dia.
          </p>
        ) : null}

        <ul className="mt-5 space-y-3">
          {selectedItems
            .slice()
            .sort((a, b) => a.desired_time.localeCompare(b.desired_time))
            .map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[var(--color-fg)]">
                      {formatAppointmentTime(item.desired_time)} · {item.service_name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                      {item.client_name} · {item.pet_name} ({item.pet_species})
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{item.client_phone}</p>
                  </div>
                  <Badge variant={appointmentStatusBadgeVariant(item.status)}>
                    {appointmentStatusLabel(item.status)}
                  </Badge>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
