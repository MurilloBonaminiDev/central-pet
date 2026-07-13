import { useMemo, useState, type FormEvent } from 'react';
import type {
  CreateFinanceTransactionInput,
  FinanceCategory,
  FinanceType,
} from '@central-pet/shared';
import {
  FINANCE_EXPENSE_CATEGORIES,
  FINANCE_INCOME_CATEGORIES,
} from '@central-pet/shared';
import { Button } from '@central-pet/ui';
import { financeApi, reaisToCents } from '../api';

type Props = {
  onCreated: () => void;
};

function todayISO() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

export function FinanceTransactionForm({ onCreated }: Props) {
  const [type, setType] = useState<FinanceType>('ENTRADA');
  const [category, setCategory] = useState<FinanceCategory>('CONSULTA');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [occurredOn, setOccurredOn] = useState(todayISO());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories = useMemo(
    () => (type === 'ENTRADA' ? FINANCE_INCOME_CATEGORIES : FINANCE_EXPENSE_CATEGORIES),
    [type],
  );

  function handleTypeChange(next: FinanceType) {
    setType(next);
    setCategory(next === 'ENTRADA' ? 'CONSULTA' : 'COMPRA');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const amountCents = reaisToCents(amount);
    if (amountCents <= 0) {
      setError('Informe um valor válido maior que zero.');
      return;
    }
    if (!description.trim()) {
      setError('Informe uma descrição.');
      return;
    }

    const payload: CreateFinanceTransactionInput = {
      type,
      category,
      description: description.trim(),
      amount_cents: amountCents,
      occurred_on: occurredOn,
    };

    setBusy(true);
    try {
      await financeApi.createTransaction(payload);
      setDescription('');
      setAmount('');
      setOccurredOn(todayISO());
      setSuccess('Movimentação registrada.');
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="cp-dash-rise rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-sm)] md:p-6">
      <header className="mb-5">
        <h3 className="font-display text-xl font-semibold text-[var(--color-fg)]">
          Nova movimentação
        </h3>
        <p className="text-sm text-[var(--color-fg-muted)]">
          Registre entradas (consultas, banhos, tosas, cirurgias, produtos) ou saídas (compras,
          despesas, custos).
        </p>
      </header>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={(e) => void handleSubmit(e)}>
        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-[var(--color-fg)]">Tipo</span>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as FinanceType)}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3"
          >
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-[var(--color-fg)]">Categoria</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as FinanceCategory)}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3"
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm md:col-span-2">
          <span className="font-semibold text-[var(--color-fg)]">Descrição</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex.: Compra de ração / Banho Thor"
            className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-[var(--color-fg)]">Valor (R$)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="150,00"
            inputMode="decimal"
            className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-semibold text-[var(--color-fg)]">Data</span>
          <input
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3"
          />
        </label>

        {error ? (
          <p className="md:col-span-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="md:col-span-2 text-sm text-[var(--color-success-700)]" role="status">
            {success}
          </p>
        ) : null}

        <div className="md:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? 'Salvando…' : 'Registrar movimentação'}
          </Button>
        </div>
      </form>
    </section>
  );
}
