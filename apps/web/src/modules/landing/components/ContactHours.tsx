import { CLINIC } from '../data/clinic';

type ContactHoursProps = {
  variant?: 'default' | 'compact';
};

export function ContactHours({ variant = 'default' }: ContactHoursProps) {
  const isCompact = variant === 'compact';

  return (
    <section
      className={isCompact ? '' : 'py-4'}
      aria-labelledby={isCompact ? undefined : 'contact-hours-title'}
    >
      {!isCompact ? (
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
            Funcionamento
          </p>
          <h2
            id="contact-hours-title"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            Horário de funcionamento
          </h2>
          <p className="mt-3 text-base text-[var(--color-fg-muted)]">
            Estamos prontos para receber você e seu pet nos horários abaixo.
          </p>
        </div>
      ) : null}

      <ul className={`grid gap-4 ${isCompact ? '' : 'max-w-3xl'}`}>
        {CLINIC.schedule.map((slot) => (
          <li
            key={slot.days}
            className={`home-hours-row flex flex-col items-center justify-between gap-2 rounded-[var(--radius-xl)] border px-6 py-5 text-center sm:flex-row sm:text-left ${
              slot.highlight
                ? 'border-[var(--color-accent-300)] bg-[var(--color-accent-50)]'
                : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]'
            }`}
          >
            <span className="font-semibold text-[var(--color-fg)]">{slot.days}</span>
            <span
              className={`text-sm font-medium ${
                slot.highlight ? 'text-[var(--color-accent-700)]' : 'text-[var(--color-brand-700)]'
              }`}
            >
              {slot.hours}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
