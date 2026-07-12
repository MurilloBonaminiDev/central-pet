import { useMemo, useState } from 'react';
import { cn } from '@central-pet/ui';
import { buildMonthCalendar, monthLabel } from '../data/mock';

const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function SideCalendar() {
  const days = useMemo(() => buildMonthCalendar(new Date()), []);
  const [selected, setSelected] = useState<number | null>(
    () => days.find((d) => d.isToday)?.date ?? null,
  );

  return (
    <section className="cp-dash-rise overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)]">
      <header className="bg-gradient-to-br from-[var(--color-sidebar-bg)] to-[var(--color-brand-800)] px-4 py-4 text-[var(--color-sidebar-fg)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-sidebar-muted)]">
          Calendário lateral
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold capitalize">{monthLabel}</h3>
      </header>
      <div className="p-4">
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[var(--color-fg-subtle)]">
          {weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isSelected = day.inMonth && selected === day.date;
            return (
              <button
                key={`${day.date}-${index}`}
                type="button"
                disabled={!day.inMonth}
                onClick={() => day.inMonth && setSelected(day.date)}
                className={cn(
                  'relative flex h-9 items-center justify-center rounded-[var(--radius-md)] text-sm transition-colors',
                  !day.inMonth && 'text-[var(--color-fg-subtle)]/35',
                  day.inMonth &&
                    !isSelected &&
                    'text-[var(--color-fg)] hover:bg-[var(--color-bg-muted)]',
                  isSelected &&
                    'bg-[var(--color-brand-600)] font-semibold text-[var(--color-primary-fg)] shadow-[var(--shadow-sm)]',
                  day.isToday && !isSelected && 'ring-1 ring-[var(--color-brand-400)]',
                )}
              >
                {day.date}
                {day.hasEvent && day.inMonth && (
                  <span
                    className={cn(
                      'absolute bottom-1 h-1 w-1 rounded-full',
                      isSelected ? 'bg-[var(--color-accent-300)]' : 'bg-[var(--color-accent-500)]',
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-[var(--color-fg-muted)]">
          Pontos marcam dias com agenda.
        </p>
      </div>
    </section>
  );
}
