/** Finance module types from API. */

export type FinanceType = 'ENTRADA' | 'SAIDA';

export type FinanceIncomeCategory =
  | 'CONSULTA'
  | 'BANHO'
  | 'TOSA'
  | 'CIRURGIA'
  | 'PRODUTO';

export type FinanceExpenseCategory = 'COMPRA' | 'DESPESA' | 'CUSTO';

export type FinanceCategory = FinanceIncomeCategory | FinanceExpenseCategory;

export type FinanceTransaction = {
  id: string;
  type: FinanceType;
  category: FinanceCategory | string;
  category_label: string;
  description: string;
  amount_cents: number;
  occurred_on: string;
  appointment_id: string | null;
  created_at: string;
};

export type FinanceTransactionList = {
  items: FinanceTransaction[];
};

export type FinanceChartPoint = {
  label: string;
  value: number;
};

export type FinanceCategoryBreakdown = {
  category: string;
  label: string;
  value: number;
  amount_cents: number;
};

export type FinanceKpis = {
  total_revenue_cents: number;
  total_expenses_cents: number;
  profit_cents: number;
  monthly_revenue_cents: number;
  monthly_expenses_cents: number;
  monthly_profit_cents: number;
};

export type FinanceSummary = {
  kpis: FinanceKpis;
  revenue_by_month: FinanceChartPoint[];
  expenses_by_month: FinanceChartPoint[];
  income_by_category: FinanceCategoryBreakdown[];
  expenses_by_category: FinanceCategoryBreakdown[];
  recent_movements: FinanceTransaction[];
};

export type CreateFinanceTransactionInput = {
  type: FinanceType;
  category: FinanceCategory;
  description: string;
  amount_cents: number;
  occurred_on: string;
};

export const FINANCE_INCOME_CATEGORIES: { value: FinanceIncomeCategory; label: string }[] = [
  { value: 'CONSULTA', label: 'Consultas' },
  { value: 'BANHO', label: 'Banhos' },
  { value: 'TOSA', label: 'Tosas' },
  { value: 'CIRURGIA', label: 'Cirurgias' },
  { value: 'PRODUTO', label: 'Produtos vendidos' },
];

export const FINANCE_EXPENSE_CATEGORIES: { value: FinanceExpenseCategory; label: string }[] = [
  { value: 'COMPRA', label: 'Compras' },
  { value: 'DESPESA', label: 'Despesas' },
  { value: 'CUSTO', label: 'Custos' },
];
