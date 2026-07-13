import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  CLIENT_HISTORY_TYPES,
  PET_SPECIES_OPTIONS,
  type ClientHistoryType,
  type CreateClientInput,
  type CreateHistoryInput,
  type CreatePetInput,
} from '@central-pet/shared';
import { Button } from '@central-pet/ui';
import { clientsApi, useClientDetail, useClients } from '@modules/clients';

function todayISO() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

function formatDate(isoDate: string) {
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

const inputClass =
  'h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm';

export function AdminClientsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'ALL' | ClientHistoryType>('ALL');

  const [clientForm, setClientForm] = useState<CreateClientInput>({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [petForm, setPetForm] = useState<CreatePetInput>({
    name: '',
    species: 'Cão',
    breed: '',
    age_years: null,
  });
  const [historyForm, setHistoryForm] = useState<CreateHistoryInput>({
    entry_type: 'OBSERVACAO',
    title: '',
    description: '',
    occurred_on: todayISO(),
    pet_id: null,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { clients, loading, error, refetch } = useClients(debouncedSearch);
  const {
    client: detail,
    loading: detailLoading,
    error: detailError,
    refetch: refetchDetail,
  } = useClientDetail(selectedId);

  useEffect(() => {
    if (!selectedId && clients.length > 0) {
      setSelectedId(clients[0].id);
    }
  }, [clients, selectedId]);

  const filteredHistory = useMemo(() => {
    if (!detail) return [];
    if (historyFilter === 'ALL') return detail.history;
    return detail.history.filter((item) => item.entry_type === historyFilter);
  }, [detail, historyFilter]);

  async function handleCreateClient(event: FormEvent) {
    event.preventDefault();
    setActionError(null);
    setBusy(true);
    try {
      const created = await clientsApi.create({
        ...clientForm,
        notes: clientForm.notes?.trim() || null,
      });
      setClientForm({ name: '', phone: '', email: '', notes: '' });
      setShowClientForm(false);
      await refetch();
      setSelectedId(created.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível cadastrar');
    } finally {
      setBusy(false);
    }
  }

  async function handleImport() {
    setActionError(null);
    setBusy(true);
    try {
      const result = await clientsApi.importFromAppointments();
      await refetch();
      if (selectedId) await refetchDetail();
      setActionError(
        result.clients_created + result.pets_created + result.history_created === 0
          ? 'Nenhum dado novo para importar dos agendamentos.'
          : `Importado: ${result.clients_created} cliente(s), ${result.pets_created} pet(s), ${result.history_created} histórico(s).`,
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Falha na importação');
    } finally {
      setBusy(false);
    }
  }

  async function handleCreatePet(event: FormEvent) {
    event.preventDefault();
    if (!selectedId) return;
    setActionError(null);
    setBusy(true);
    try {
      await clientsApi.createPet(selectedId, {
        ...petForm,
        breed: petForm.breed || '',
        age_years:
          petForm.age_years === null || petForm.age_years === undefined
            ? null
            : Number(petForm.age_years),
      });
      setPetForm({ name: '', species: 'Cão', breed: '', age_years: null });
      await refetchDetail();
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível salvar o pet');
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateHistory(event: FormEvent) {
    event.preventDefault();
    if (!selectedId) return;
    setActionError(null);
    setBusy(true);
    try {
      await clientsApi.createHistory(selectedId, {
        ...historyForm,
        description: historyForm.description?.trim() || null,
        pet_id: historyForm.pet_id || null,
      });
      setHistoryForm({
        entry_type: 'OBSERVACAO',
        title: '',
        description: '',
        occurred_on: todayISO(),
        pet_id: null,
      });
      await refetchDetail();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível salvar o histórico');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteHistory(historyId: string) {
    if (!selectedId) return;
    setBusy(true);
    setActionError(null);
    try {
      await clientsApi.removeHistory(selectedId, historyId);
      await refetchDetail();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível excluir');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeletePet(petId: string) {
    if (!selectedId) return;
    setBusy(true);
    setActionError(null);
    try {
      await clientsApi.removePet(selectedId, petId);
      await refetchDetail();
      await refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível excluir o pet');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-brand-600)]">
            Relacionamento
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[var(--color-fg)]">
            Clientes
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            Cadastro de tutores, pets relacionados e histórico clínico (consultas, serviços, vacinas
            e observações).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => void refetch()}>
            Atualizar
          </Button>
          <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => void handleImport()}>
            Importar agendamentos
          </Button>
          <Button type="button" size="sm" onClick={() => setShowClientForm((v) => !v)}>
            {showClientForm ? 'Fechar formulário' : 'Novo cliente'}
          </Button>
        </div>
      </header>

      {actionError ? (
        <p
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-fg)]"
          role="status"
        >
          {actionError}
        </p>
      ) : null}

      {showClientForm ? (
        <form
          onSubmit={(e) => void handleCreateClient(e)}
          className="grid gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 md:grid-cols-2"
        >
          <h2 className="font-display text-lg font-semibold md:col-span-2">Cadastrar cliente</h2>
          <label className="grid gap-1.5 text-sm">
            <span className="font-semibold">Nome</span>
            <input
              required
              className={inputClass}
              value={clientForm.name}
              onChange={(e) => setClientForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-semibold">Telefone</span>
            <input
              required
              className={inputClass}
              value={clientForm.phone}
              onChange={(e) => setClientForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </label>
          <label className="grid gap-1.5 text-sm md:col-span-2">
            <span className="font-semibold">E-mail</span>
            <input
              required
              type="email"
              className={inputClass}
              value={clientForm.email}
              onChange={(e) => setClientForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <div className="md:col-span-2">
            <Button type="submit" disabled={busy}>
              {busy ? 'Salvando…' : 'Salvar cliente'}
            </Button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <section className="space-y-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone"
            className={`w-full ${inputClass}`}
          />

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-red-700">{error}</p>
          ) : clients.length === 0 ? (
            <p className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-10 text-center text-sm text-[var(--color-fg-muted)]">
              Nenhum cliente cadastrado. Cadastre manualmente ou importe dos agendamentos.
            </p>
          ) : (
            <ul className="space-y-2">
              {clients.map((item) => {
                const active = item.id === selectedId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full rounded-[var(--radius-lg)] border px-4 py-3 text-left transition-colors ${
                        active
                          ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10'
                          : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-brand-400)]'
                      }`}
                    >
                      <p className="font-semibold text-[var(--color-fg)]">{item.name}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">
                        {item.phone} · {item.email}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[var(--color-brand-700)]">
                        {item.pets_count} pet{item.pets_count === 1 ? '' : 's'}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="space-y-6">
          {!selectedId ? (
            <p className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-16 text-center text-sm text-[var(--color-fg-muted)]">
              Selecione um cliente para ver pets e histórico.
            </p>
          ) : detailLoading ? (
            <div className="h-64 animate-pulse rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]" />
          ) : detailError || !detail ? (
            <p className="text-sm text-red-700">{detailError ?? 'Cliente não encontrado'}</p>
          ) : (
            <>
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)] md:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]">
                  Cliente
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--color-fg)]">
                  {detail.name}
                </h2>
                <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      Telefone
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-[var(--color-fg)]">{detail.phone}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      E-mail
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-[var(--color-fg)]">{detail.email}</dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[var(--color-fg)]">
                      Pets relacionados
                    </h3>
                    <p className="text-sm text-[var(--color-fg-muted)]">
                      Nome, espécie, raça e idade
                    </p>
                  </div>
                </div>

                {detail.pets.length === 0 ? (
                  <p className="text-sm text-[var(--color-fg-muted)]">Nenhum pet cadastrado.</p>
                ) : (
                  <div className="overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                        <tr>
                          <th className="px-4 py-3">Nome</th>
                          <th className="px-4 py-3">Espécie</th>
                          <th className="px-4 py-3">Raça</th>
                          <th className="px-4 py-3">Idade</th>
                          <th className="px-4 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.pets.map((pet) => (
                          <tr key={pet.id} className="border-b border-[var(--color-border)] last:border-0">
                            <td className="px-4 py-3 font-medium">{pet.name}</td>
                            <td className="px-4 py-3">{pet.species}</td>
                            <td className="px-4 py-3">{pet.breed || '—'}</td>
                            <td className="px-4 py-3">
                              {pet.age_years == null
                                ? '—'
                                : `${pet.age_years} ano${pet.age_years === 1 ? '' : 's'}`}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                onClick={() => void handleDeletePet(pet.id)}
                              >
                                Excluir
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <form
                  onSubmit={(e) => void handleCreatePet(e)}
                  className="grid gap-3 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 p-4 md:grid-cols-4"
                >
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold">Nome</span>
                    <input
                      required
                      className={inputClass}
                      value={petForm.name}
                      onChange={(e) => setPetForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold">Espécie</span>
                    <select
                      className={inputClass}
                      value={petForm.species}
                      onChange={(e) => setPetForm((f) => ({ ...f, species: e.target.value }))}
                    >
                      {PET_SPECIES_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold">Raça</span>
                    <input
                      className={inputClass}
                      value={petForm.breed ?? ''}
                      onChange={(e) => setPetForm((f) => ({ ...f, breed: e.target.value }))}
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold">Idade (anos)</span>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      className={inputClass}
                      value={petForm.age_years ?? ''}
                      onChange={(e) =>
                        setPetForm((f) => ({
                          ...f,
                          age_years: e.target.value === '' ? null : Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                  <div className="md:col-span-4">
                    <Button type="submit" size="sm" disabled={busy}>
                      Adicionar pet
                    </Button>
                  </div>
                </form>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-[var(--color-fg)]">
                    Histórico
                  </h3>
                  <p className="text-sm text-[var(--color-fg-muted)]">
                    Consultas, serviços realizados, vacinas e observações
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('ALL')}
                    className={`h-9 rounded-full px-3.5 text-sm font-semibold ${
                      historyFilter === 'ALL'
                        ? 'bg-[var(--color-brand-600)] text-[var(--color-primary-fg)]'
                        : 'border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)]'
                    }`}
                  >
                    Todos
                  </button>
                  {CLIENT_HISTORY_TYPES.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setHistoryFilter(item.value)}
                      className={`h-9 rounded-full px-3.5 text-sm font-semibold ${
                        historyFilter === item.value
                          ? 'bg-[var(--color-brand-600)] text-[var(--color-primary-fg)]'
                          : 'border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {filteredHistory.length === 0 ? (
                  <p className="text-sm text-[var(--color-fg-muted)]">
                    Nenhum registro neste filtro.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {filteredHistory.map((entry) => (
                      <li
                        key={entry.id}
                        className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-700)]">
                              {entry.entry_type_label}
                            </p>
                            <p className="mt-1 font-semibold text-[var(--color-fg)]">{entry.title}</p>
                            <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                              {formatDate(entry.occurred_on)}
                              {entry.pet_name ? ` · ${entry.pet_name}` : ''}
                            </p>
                            {entry.description ? (
                              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-fg-muted)]">
                                {entry.description}
                              </p>
                            ) : null}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => void handleDeleteHistory(entry.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <form
                  onSubmit={(e) => void handleCreateHistory(e)}
                  className="grid gap-3 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)]/70 p-4 md:grid-cols-2"
                >
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold">Tipo</span>
                    <select
                      className={inputClass}
                      value={historyForm.entry_type}
                      onChange={(e) =>
                        setHistoryForm((f) => ({
                          ...f,
                          entry_type: e.target.value as ClientHistoryType,
                        }))
                      }
                    >
                      {CLIENT_HISTORY_TYPES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold">Data</span>
                    <input
                      type="date"
                      required
                      className={inputClass}
                      value={historyForm.occurred_on}
                      onChange={(e) =>
                        setHistoryForm((f) => ({ ...f, occurred_on: e.target.value }))
                      }
                    />
                  </label>
                  <label className="grid gap-1 text-sm md:col-span-2">
                    <span className="font-semibold">Título</span>
                    <input
                      required
                      className={inputClass}
                      value={historyForm.title}
                      onChange={(e) => setHistoryForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Ex.: Vacina V10 / Observação pós-cirúrgica"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-semibold">Pet (opcional)</span>
                    <select
                      className={inputClass}
                      value={historyForm.pet_id ?? ''}
                      onChange={(e) =>
                        setHistoryForm((f) => ({
                          ...f,
                          pet_id: e.target.value || null,
                        }))
                      }
                    >
                      <option value="">Nenhum</option>
                      {detail.pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm md:col-span-2">
                    <span className="font-semibold">Descrição / observação</span>
                    <textarea
                      rows={3}
                      className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm"
                      value={historyForm.description ?? ''}
                      onChange={(e) =>
                        setHistoryForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                  </label>
                  <div className="md:col-span-2">
                    <Button type="submit" size="sm" disabled={busy}>
                      Adicionar ao histórico
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
