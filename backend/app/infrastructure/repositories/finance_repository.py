from __future__ import annotations

import uuid
from datetime import UTC, date, datetime

from sqlalchemy import extract, func, select
from sqlalchemy.orm import Session

from app.infrastructure.database.models import FinanceTransactionModel
from app.infrastructure.repositories.appointment_repository import MONTH_LABELS_PT

FINANCE_TYPE_INCOME = "ENTRADA"
FINANCE_TYPE_EXPENSE = "SAIDA"

INCOME_CATEGORIES = ("CONSULTA", "BANHO", "TOSA", "CIRURGIA", "PRODUTO")
EXPENSE_CATEGORIES = ("COMPRA", "DESPESA", "CUSTO")

CATEGORY_LABELS = {
    "CONSULTA": "Consultas",
    "BANHO": "Banhos",
    "TOSA": "Tosas",
    "CIRURGIA": "Cirurgias",
    "PRODUTO": "Produtos vendidos",
    "COMPRA": "Compras",
    "DESPESA": "Despesas",
    "CUSTO": "Custos",
}


def infer_income_category(service_name: str) -> str:
    name = service_name.casefold()
    if "banho" in name:
        return "BANHO"
    if "tosa" in name:
        return "TOSA"
    if "cirurg" in name or "castra" in name:
        return "CIRURGIA"
    if "produto" in name or "ração" in name or "racao" in name:
        return "PRODUTO"
    return "CONSULTA"


class FinanceRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def list(
        self,
        tenant_id: uuid.UUID,
        *,
        type_filter: str | None = None,
        limit: int = 100,
    ) -> list[FinanceTransactionModel]:
        stmt = select(FinanceTransactionModel).where(
            FinanceTransactionModel.tenant_id == tenant_id,
            FinanceTransactionModel.deleted_at.is_(None),
        )
        if type_filter:
            stmt = stmt.where(FinanceTransactionModel.type == type_filter)
        stmt = stmt.order_by(
            FinanceTransactionModel.occurred_on.desc(),
            FinanceTransactionModel.created_at.desc(),
        ).limit(limit)
        return list(self._db.scalars(stmt).all())

    def get_by_id(
        self, tenant_id: uuid.UUID, transaction_id: uuid.UUID
    ) -> FinanceTransactionModel | None:
        stmt = select(FinanceTransactionModel).where(
            FinanceTransactionModel.id == transaction_id,
            FinanceTransactionModel.tenant_id == tenant_id,
            FinanceTransactionModel.deleted_at.is_(None),
        )
        return self._db.scalar(stmt)

    def get_by_appointment(
        self, tenant_id: uuid.UUID, appointment_id: uuid.UUID
    ) -> FinanceTransactionModel | None:
        stmt = select(FinanceTransactionModel).where(
            FinanceTransactionModel.tenant_id == tenant_id,
            FinanceTransactionModel.appointment_id == appointment_id,
            FinanceTransactionModel.deleted_at.is_(None),
        )
        return self._db.scalar(stmt)

    def create(
        self,
        *,
        tenant_id: uuid.UUID,
        type: str,
        category: str,
        description: str,
        amount_cents: int,
        occurred_on: date,
        appointment_id: uuid.UUID | None = None,
    ) -> FinanceTransactionModel:
        row = FinanceTransactionModel(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            type=type,
            category=category,
            description=description,
            amount_cents=amount_cents,
            occurred_on=occurred_on,
            appointment_id=appointment_id,
        )
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        return row

    def save(self, row: FinanceTransactionModel) -> FinanceTransactionModel:
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        return row

    def soft_delete(self, row: FinanceTransactionModel) -> None:
        row.deleted_at = datetime.now(UTC)
        self._db.add(row)
        self._db.commit()

    def sum_by_type(
        self,
        tenant_id: uuid.UUID,
        type_value: str,
        *,
        year: int | None = None,
        month: int | None = None,
    ) -> int:
        stmt = (
            select(func.coalesce(func.sum(FinanceTransactionModel.amount_cents), 0))
            .where(
                FinanceTransactionModel.tenant_id == tenant_id,
                FinanceTransactionModel.type == type_value,
                FinanceTransactionModel.deleted_at.is_(None),
            )
        )
        if year is not None:
            stmt = stmt.where(extract("year", FinanceTransactionModel.occurred_on) == year)
        if month is not None:
            stmt = stmt.where(extract("month", FinanceTransactionModel.occurred_on) == month)
        return int(self._db.scalar(stmt) or 0)

    def series_by_month(
        self,
        tenant_id: uuid.UUID,
        type_value: str,
        months: int = 12,
    ) -> list[dict]:
        today = date.today()
        year, month = today.year, today.month
        for _ in range(months - 1):
            month -= 1
            if month == 0:
                month = 12
                year -= 1
        start_date = date(year, month, 1)

        stmt = (
            select(
                extract("year", FinanceTransactionModel.occurred_on).label("year"),
                extract("month", FinanceTransactionModel.occurred_on).label("month"),
                func.coalesce(func.sum(FinanceTransactionModel.amount_cents), 0).label("total"),
            )
            .where(
                FinanceTransactionModel.tenant_id == tenant_id,
                FinanceTransactionModel.type == type_value,
                FinanceTransactionModel.deleted_at.is_(None),
                FinanceTransactionModel.occurred_on >= start_date,
            )
            .group_by("year", "month")
            .order_by("year", "month")
        )
        rows = {(int(r.year), int(r.month)): int(r.total) for r in self._db.execute(stmt)}

        series: list[dict] = []
        y, m = year, month
        for _ in range(months):
            cents = rows.get((y, m), 0)
            series.append(
                {
                    "label": f"{MONTH_LABELS_PT[m]}/{str(y)[2:]}",
                    "value": round(cents / 100, 2),
                    "year": y,
                    "month": m,
                }
            )
            m += 1
            if m == 13:
                m = 1
                y += 1
        return series

    def breakdown_by_category(
        self,
        tenant_id: uuid.UUID,
        type_value: str,
        *,
        year: int | None = None,
        month: int | None = None,
    ) -> list[dict]:
        stmt = (
            select(
                FinanceTransactionModel.category,
                func.coalesce(func.sum(FinanceTransactionModel.amount_cents), 0).label("total"),
            )
            .where(
                FinanceTransactionModel.tenant_id == tenant_id,
                FinanceTransactionModel.type == type_value,
                FinanceTransactionModel.deleted_at.is_(None),
            )
            .group_by(FinanceTransactionModel.category)
            .order_by(func.sum(FinanceTransactionModel.amount_cents).desc())
        )
        if year is not None:
            stmt = stmt.where(extract("year", FinanceTransactionModel.occurred_on) == year)
        if month is not None:
            stmt = stmt.where(extract("month", FinanceTransactionModel.occurred_on) == month)

        return [
            {
                "category": row.category,
                "label": CATEGORY_LABELS.get(row.category, row.category),
                "value": round(int(row.total) / 100, 2),
                "amount_cents": int(row.total),
            }
            for row in self._db.execute(stmt)
        ]
