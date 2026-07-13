const SCHEDULE = [
  { days: 'Segunda a Sexta', hours: '08:00 — 20:00' },
  { days: 'Sábado', hours: '08:00 — 14:00' },
  { days: 'Domingo & Feriados', hours: 'Plantão de emergência', highlight: true },
] as const;

export function HomeHours() {
  return (
    <section
      id="horarios"
      className="scroll-mt-20 border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20 sm:py-24"
      aria-labelledby="home-hours-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
            Funcionamento
          </p>
          <h2
            id="home-hours-title"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl"
          >
            Horário de funcionamento
          </h2>
          <p className="mt-3 text-base text-[var(--color-fg-muted)]">
            Estamos prontos para receber você e seu pet nos horários abaixo.
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-4">
          {SCHEDULE.map((slot) => (
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
      </div>
    </section>
  );
}
