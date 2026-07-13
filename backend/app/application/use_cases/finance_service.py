from __future__ import annotations

import uuid
from datetime import date, datetime

from app.application.dto.finance import (
    FinanceCategoryBreakdownDTO,
    FinanceChartPointDTO,
    FinanceKpisDTO,
    FinanceSummaryDTO,
    FinanceTransactionDTO,
    FinanceTransactionListDTO,
)
from app.domain.exceptions import NotFoundError, ValidationError
from app.infrastructure.database.models import FinanceTransactionModel
from app.infrastructure.repositories.finance_repository import (
    CATEGORY_LABELS,
    EXPENSE_CATEGORIES,
    FINANCE_TYPE_EXPENSE,
    FINANCE_TYPE_INCOME,
    INCOME_CATEGORIES,
    FinanceRepository,
    infer_income_category,
)


class FinanceService:
    def __init__(self, repository: FinanceRepository) -> None:
        self._repo = repository

    @staticmethod
    def _to_dto(row: FinanceTransactionModel) -> FinanceTransactionDTO:
        created = row.created_at
        created_str = created.isoformat() if isinstance(created, datetime) else str(created)
        return FinanceTransactionDTO(
            id=str(row.id),
            type=row.type,
            category=row.category,
            category_label=CATEGORY_LABELS.get(row.category, row.category),
            description=row.description,
            amount_cents=row.amount_cents,
            occurred_on=row.occurred_on,
            appointment_id=str(row.appointment_id) if row.appointment_id else None,
            created_at=created_str,
        )

    def list_transactions(
        self,
        tenant_id: str,
        *,
        type_filter: str | None = None,
    ) -> FinanceTransactionListDTO:
        if type_filter and type_filter not in {FINANCE_TYPE_INCOME, FINANCE_TYPE_EXPENSE}:
            raise ValidationError("Tipo inválido")
        items = self._repo.list(uuid.UUID(tenant_id), type_filter=type_filter, limit=200)
        return FinanceTransactionListDTO(items=[self._to_dto(item) for item in items])

    def get_summary(self, tenant_id: str) -> FinanceSummaryDTO:
        tid = uuid.UUID(tenant_id)
        today = date.today()

        total_revenue = self._repo.sum_by_type(tid, FINANCE_TYPE_INCOME)
        total_expenses = self._repo.sum_by_type(tid, FINANCE_TYPE_EXPENSE)
        monthly_revenue = self._repo.sum_by_type(
            tid, FINANCE_TYPE_INCOME, year=today.year, month=today.month
        )
        monthly_expenses = self._repo.sum_by_type(
            tid, FINANCE_TYPE_EXPENSE, year=today.year, month=today.month
        )

        kpis = FinanceKpisDTO(
            total_revenue_cents=total_revenue,
            total_expenses_cents=total_expenses,
            profit_cents=total_revenue - total_expenses,
            monthly_revenue_cents=monthly_revenue,
            monthly_expenses_cents=monthly_expenses,
            monthly_profit_cents=monthly_revenue - monthly_expenses,
        )

        recent = self._repo.list(tid, limit=15)
        return FinanceSummaryDTO(
            kpis=kpis,
            revenue_by_month=[
                FinanceChartPointDTO(label=i["label"], value=float(i["value"]))
                for i in self._repo.series_by_month(tid, FINANCE_TYPE_INCOME)
            ],
            expenses_by_month=[
                FinanceChartPointDTO(label=i["label"], value=float(i["value"]))
                for i in self._repo.series_by_month(tid, FINANCE_TYPE_EXPENSE)
            ],
            income_by_category=[
                FinanceCategoryBreakdownDTO(**item)
                for item in self._repo.breakdown_by_category(
                    tid, FINANCE_TYPE_INCOME, year=today.year, month=today.month
                )
            ],
            expenses_by_category=[
                FinanceCategoryBreakdownDTO(**item)
                for item in self._repo.breakdown_by_category(
                    tid, FINANCE_TYPE_EXPENSE, year=today.year, month=today.month
                )
            ],
            recent_movements=[self._to_dto(item) for item in recent],
        )

    def create(
        self,
        tenant_id: str,
        *,
        type: str,
        category: str,
        description: str,
        amount_cents: int,
        occurred_on: date,
    ) -> FinanceTransactionDTO:
        self._validate(type=type, category=category, description=description, amount_cents=amount_cents)
        row = self._repo.create(
            tenant_id=uuid.UUID(tenant_id),
            type=type,
            category=category,
            description=description.strip(),
            amount_cents=amount_cents,
            occurred_on=occurred_on,
        )
        return self._to_dto(row)

    def update(
        self,
        tenant_id: str,
        transaction_id: str,
        *,
        type: str | None = None,
        category: str | None = None,
        description: str | None = None,
        amount_cents: int | None = None,
        occurred_on: date | None = None,
    ) -> FinanceTransactionDTO:
        row = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(transaction_id))
        if row is None:
            raise NotFoundError("Movimentação não encontrada")

        next_type = type or row.type
        next_category = category or row.category
        next_description = description if description is not None else row.description
        next_amount = amount_cents if amount_cents is not None else row.amount_cents
        self._validate(
            type=next_type,
            category=next_category,
            description=next_description,
            amount_cents=next_amount,
        )

        row.type = next_type
        row.category = next_category
        row.description = next_description.strip()
        row.amount_cents = next_amount
        if occurred_on is not None:
            row.occurred_on = occurred_on
        self._repo.save(row)
        return self._to_dto(row)

    def delete(self, tenant_id: str, transaction_id: str) -> None:
        row = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(transaction_id))
        if row is None:
            raise NotFoundError("Movimentação não encontrada")
        self._repo.soft_delete(row)

    def record_appointment_income(
        self,
        tenant_id: uuid.UUID,
        *,
        appointment_id: uuid.UUID,
        service_name: str,
        amount_cents: int | None,
        occurred_on: date,
        client_name: str,
        pet_name: str,
    ) -> FinanceTransactionDTO | None:
        if amount_cents is None or amount_cents <= 0:
            return None
        existing = self._repo.get_by_appointment(tenant_id, appointment_id)
        if existing is not None:
            return self._to_dto(existing)

        category = infer_income_category(service_name)
        row = self._repo.create(
            tenant_id=tenant_id,
            type=FINANCE_TYPE_INCOME,
            category=category,
            description=f"{service_name} — {pet_name} ({client_name})",
            amount_cents=amount_cents,
            occurred_on=occurred_on,
            appointment_id=appointment_id,
        )
        return self._to_dto(row)

    @staticmethod
    def _validate(*, type: str, category: str, description: str, amount_cents: int) -> None:
        if type not in {FINANCE_TYPE_INCOME, FINANCE_TYPE_EXPENSE}:
            raise ValidationError("Tipo deve ser ENTRADA ou SAIDA")
        allowed = INCOME_CATEGORIES if type == FINANCE_TYPE_INCOME else EXPENSE_CATEGORIES
        if category not in allowed:
            raise ValidationError("Categoria inválida para o tipo informado")
        if not description.strip():
            raise ValidationError("Descrição é obrigatória")
        if amount_cents <= 0:
            raise ValidationError("Valor deve ser maior que zero")
