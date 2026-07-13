from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field


class FinanceTransactionDTO(BaseModel):
    id: str
    type: str
    category: str
    category_label: str
    description: str
    amount_cents: int
    occurred_on: date
    appointment_id: str | None
    created_at: str


class FinanceTransactionListDTO(BaseModel):
    items: list[FinanceTransactionDTO] = Field(default_factory=list)


class FinanceChartPointDTO(BaseModel):
    label: str
    value: float


class FinanceCategoryBreakdownDTO(BaseModel):
    category: str
    label: str
    value: float
    amount_cents: int


class FinanceKpisDTO(BaseModel):
    total_revenue_cents: int
    total_expenses_cents: int
    profit_cents: int
    monthly_revenue_cents: int
    monthly_expenses_cents: int
    monthly_profit_cents: int


class FinanceSummaryDTO(BaseModel):
    kpis: FinanceKpisDTO
    revenue_by_month: list[FinanceChartPointDTO] = Field(default_factory=list)
    expenses_by_month: list[FinanceChartPointDTO] = Field(default_factory=list)
    income_by_category: list[FinanceCategoryBreakdownDTO] = Field(default_factory=list)
    expenses_by_category: list[FinanceCategoryBreakdownDTO] = Field(default_factory=list)
    recent_movements: list[FinanceTransactionDTO] = Field(default_factory=list)
