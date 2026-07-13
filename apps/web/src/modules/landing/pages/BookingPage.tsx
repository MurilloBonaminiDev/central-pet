import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { PET_SPECIES_OPTIONS } from '@central-pet/shared';
import { ROUTES } from '@app/router/paths';
import { PUBLIC_CLINIC_SLUG } from '@/config/public';
import { appointmentsApi } from '@modules/appointments';
import { usePublicServices } from '@modules/services';
import { SiteLayout } from '../components/SiteLayout';
import { SitePageHero } from '../components/SitePageHero';
import '../styles/landing.css';

const TIME_SLOTS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
] as const;

type FormState = {
  client_name: string;
  client_phone: string;
  client_email: string;
  pet_name: string;
  pet_species: string;
  service_id: string;
  desired_date: string;
  desired_time: string;
  notes: string;
};

const INITIAL_FORM: FormState = {
  client_name: '',
  client_phone: '',
  client_email: '',
  pet_name: '',
  pet_species: 'Cão',
  service_id: '',
  desired_date: '',
  desired_time: '',
  notes: '',
};

function fieldClassName() {
  return 'mt-2 h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 text-sm text-[var(--color-fg)] outline-none transition-shadow placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_3px_var(--color-ring)]';
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingPage() {
  const { services, loading: loadingServices } = usePublicServices();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const minDate = useMemo(() => todayISO(), []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!form.service_id) {
      setError('Selecione o serviço desejado.');
      return;
    }

    const selectedService = services.find((item) => item.id === form.service_id);
    if (!selectedService) {
      setError('Serviço inválido. Atualize a página e tente novamente.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await appointmentsApi.createPublic(PUBLIC_CLINIC_SLUG, {
        client_name: form.client_name.trim(),
        client_phone: form.client_phone.trim(),
        client_email: form.client_email.trim(),
        pet_name: form.pet_name.trim(),
        pet_species: form.pet_species,
        service_id: selectedService.id,
        service_name: selectedService.name,
        desired_date: form.desired_date,
        desired_time: form.desired_time.length === 5 ? `${form.desired_time}:00` : form.desired_time,
        notes: form.notes.trim() || null,
      });
      setSuccessMessage(result.message);
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar a solicitação.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <SitePageHero
        eyebrow="Agendamento"
        title="Solicitar atendimento"
        description="Preencha o formulário com os dados do tutor e do pet. Nossa equipe confirma o horário e entra em contato."
      />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {successMessage ? (
          <div
            className="rounded-[var(--radius-xl)] border border-[var(--color-accent-300)] bg-[var(--color-accent-50)] px-6 py-10 text-center"
            role="status"
          >
            <p className="font-display text-2xl font-semibold text-[var(--color-fg)]">
              Solicitação recebida
            </p>
            <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
              {successMessage}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-5 text-sm font-semibold text-[var(--color-primary-fg)] hover:bg-[var(--color-brand-700)]"
              >
                Nova solicitação
              </button>
              <Link
                to={ROUTES.home}
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 text-sm font-semibold text-[var(--color-fg)] hover:border-[var(--color-brand-400)]"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-sm)] sm:p-8"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="client_name" className="text-sm font-medium text-[var(--color-fg)]">
                  Nome do cliente
                </label>
                <input
                  id="client_name"
                  name="client_name"
                  required
                  autoComplete="name"
                  value={form.client_name}
                  onChange={(e) => updateField('client_name', e.target.value)}
                  className={fieldClassName()}
                />
              </div>

              <div>
                <label htmlFor="client_phone" className="text-sm font-medium text-[var(--color-fg)]">
                  Telefone
                </label>
                <input
                  id="client_phone"
                  name="client_phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  value={form.client_phone}
                  onChange={(e) => updateField('client_phone', e.target.value)}
                  className={fieldClassName()}
                />
              </div>

              <div>
                <label htmlFor="client_email" className="text-sm font-medium text-[var(--color-fg)]">
                  E-mail
                </label>
                <input
                  id="client_email"
                  name="client_email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.client_email}
                  onChange={(e) => updateField('client_email', e.target.value)}
                  className={fieldClassName()}
                />
              </div>

              <div>
                <label htmlFor="pet_name" className="text-sm font-medium text-[var(--color-fg)]">
                  Nome do pet
                </label>
                <input
                  id="pet_name"
                  name="pet_name"
                  required
                  value={form.pet_name}
                  onChange={(e) => updateField('pet_name', e.target.value)}
                  className={fieldClassName()}
                />
              </div>

              <div>
                <label htmlFor="pet_species" className="text-sm font-medium text-[var(--color-fg)]">
                  Espécie
                </label>
                <select
                  id="pet_species"
                  name="pet_species"
                  required
                  value={form.pet_species}
                  onChange={(e) => updateField('pet_species', e.target.value)}
                  className={fieldClassName()}
                >
                  {PET_SPECIES_OPTIONS.map((species) => (
                    <option key={species} value={species}>
                      {species}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="service_id" className="text-sm font-medium text-[var(--color-fg)]">
                  Serviço desejado
                </label>
                <select
                  id="service_id"
                  name="service_id"
                  required
                  disabled={loadingServices}
                  value={form.service_id}
                  onChange={(e) => updateField('service_id', e.target.value)}
                  className={fieldClassName()}
                >
                  <option value="">
                    {loadingServices ? 'Carregando serviços...' : 'Selecione um serviço'}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="desired_date" className="text-sm font-medium text-[var(--color-fg)]">
                  Data desejada
                </label>
                <input
                  id="desired_date"
                  name="desired_date"
                  type="date"
                  required
                  min={minDate}
                  value={form.desired_date}
                  onChange={(e) => updateField('desired_date', e.target.value)}
                  className={fieldClassName()}
                />
              </div>

              <div>
                <label htmlFor="desired_time" className="text-sm font-medium text-[var(--color-fg)]">
                  Horário desejado
                </label>
                <select
                  id="desired_time"
                  name="desired_time"
                  required
                  value={form.desired_time}
                  onChange={(e) => updateField('desired_time', e.target.value)}
                  className={fieldClassName()}
                >
                  <option value="">Selecione um horário</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="notes" className="text-sm font-medium text-[var(--color-fg)]">
                  Observação
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Informações extras sobre o pet ou o atendimento (opcional)"
                  className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-3 text-sm text-[var(--color-fg)] outline-none transition-shadow placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
                />
              </div>
            </div>

            {error ? (
              <p className="mt-5 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting || loadingServices}
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-5 text-sm font-semibold text-[var(--color-primary-fg)] transition-colors hover:bg-[var(--color-brand-700)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Enviando...' : 'Enviar solicitação'}
            </button>

            <p className="mt-4 text-center text-xs text-[var(--color-fg-muted)]">
              Sua solicitação fica com status <strong>PENDENTE</strong> até a clínica confirmar.
            </p>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}
