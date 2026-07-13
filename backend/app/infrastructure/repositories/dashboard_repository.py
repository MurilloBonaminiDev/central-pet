from __future__ import annotations

import uuid
from datetime import date
from typing import Any

from sqlalchemy import case, extract, func, select
from sqlalchemy.orm import Session

from app.infrastructure.database.models import AppointmentModel, ServiceModel
from app.infrastructure.repositories.appointment_repository import (
    APPOINTMENT_STATUS_COMPLETED,
    APPOINTMENT_STATUS_PENDING,
    MONTH_LABELS_PT,
)


class DashboardRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def count_pending(self, tenant_id: uuid.UUID) -> int:
        stmt = (
            select(func.count())
            .select_from(AppointmentModel)
            .where(
                AppointmentModel.tenant_id == tenant_id,
                AppointmentModel.status == APPOINTMENT_STATUS_PENDING,
            )
        )
        return int(self._db.scalar(stmt) or 0)

    def count_today(self, tenant_id: uuid.UUID, today: date) -> int:
        stmt = (
            select(func.count())
            .select_from(AppointmentModel)
            .where(
                AppointmentModel.tenant_id == tenant_id,
                AppointmentModel.desired_date == today,
                AppointmentModel.status != "CANCELADO",
            )
        )
        return int(self._db.scalar(stmt) or 0)

    def count_unique_clients(self, tenant_id: uuid.UUID) -> int:
        stmt = (
            select(func.count(func.distinct(AppointmentModel.client_email)))
            .select_from(AppointmentModel)
            .where(AppointmentModel.tenant_id == tenant_id)
        )
        return int(self._db.scalar(stmt) or 0)

    def count_completed_services(self, tenant_id: uuid.UUID) -> int:
        stmt = (
            select(func.count())
            .select_from(AppointmentModel)
            .where(
                AppointmentModel.tenant_id == tenant_id,
                AppointmentModel.status == APPOINTMENT_STATUS_COMPLETED,
            )
        )
        return int(self._db.scalar(stmt) or 0)

    def sum_monthly_revenue_cents(self, tenant_id: uuid.UUID, year: int, month: int) -> int:
        price_expr = self._effective_price_expr()
        stmt = (
            select(func.coalesce(func.sum(price_expr), 0))
            .select_from(AppointmentModel)
            .outerjoin(ServiceModel, AppointmentModel.service_id == ServiceModel.id)
            .where(
                AppointmentModel.tenant_id == tenant_id,
                AppointmentModel.status == APPOINTMENT_STATUS_COMPLETED,
                extract("year", AppointmentModel.desired_date) == year,
                extract("month", AppointmentModel.desired_date) == month,
            )
        )
        return int(self._db.scalar(stmt) or 0)

    def attendances_by_month(self, tenant_id: uuid.UUID, months: int = 12) -> list[dict[str, Any]]:
        today = date.today()
        start = date(today.year, today.month, 1)
        # go back (months-1)
        year, month = start.year, start.month
        for _ in range(months - 1):
            month -= 1
            if month == 0:
                month = 12
                year -= 1
        start_date = date(year, month, 1)

        stmt = (
            select(
                extract("year", AppointmentModel.desired_date).label("year"),
                extract("month", AppointmentModel.desired_date).label("month"),
                func.count().label("total"),
            )
            .where(
                AppointmentModel.tenant_id == tenant_id,
                AppointmentModel.status == APPOINTMENT_STATUS_COMPLETED,
                AppointmentModel.desired_date >= start_date,
            )
            .group_by("year", "month")
            .order_by("year", "month")
        )
        rows = { (int(r.year), int(r.month)): int(r.total) for r in self._db.execute(stmt) }

        series: list[dict[str, Any]] = []
        y, m = year, month
        for _ in range(months):
            label = f"{MONTH_LABELS_PT[m]}/{str(y)[2:]}"
            series.append({"label": label, "value": rows.get((y, m), 0), "year": y, "month": m})
            m += 1
            if m == 13:
                m = 1
                y += 1
        return series

    def top_services(self, tenant_id: uuid.UUID, limit: int = 8) -> list[dict[str, Any]]:
        stmt = (
            select(
                AppointmentModel.service_name,
                func.count().label("total"),
            )
            .where(
                AppointmentModel.tenant_id == tenant_id,
                AppointmentModel.status == APPOINTMENT_STATUS_COMPLETED,
            )
            .group_by(AppointmentModel.service_name)
            .order_by(func.count().desc(), AppointmentModel.service_name.asc())
            .limit(limit)
        )
        return [
            {"label": row.service_name, "value": int(row.total)}
            for row in self._db.execute(stmt)
        ]

    def revenue_by_month(self, tenant_id: uuid.UUID, months: int = 12) -> list[dict[str, Any]]:
        today = date.today()
        year, month = today.year, today.month
        for _ in range(months - 1):
            month -= 1
            if month == 0:
                month = 12
                year -= 1
        start_date = date(year, month, 1)

        price_expr = self._effective_price_expr()
        stmt = (
            select(
                extract("year", AppointmentModel.desired_date).label("year"),
                extract("month", AppointmentModel.desired_date).label("month"),
                func.coalesce(func.sum(price_expr), 0).label("total"),
            )
            .select_from(AppointmentModel)
            .outerjoin(ServiceModel, AppointmentModel.service_id == ServiceModel.id)
            .where(
                AppointmentModel.tenant_id == tenant_id,
                AppointmentModel.status == APPOINTMENT_STATUS_COMPLETED,
                AppointmentModel.desired_date >= start_date,
            )
            .group_by("year", "month")
            .order_by("year", "month")
        )
        rows = {
            (int(r.year), int(r.month)): int(r.total)
            for r in self._db.execute(stmt)
        }

        series: list[dict[str, Any]] = []
        y, m = year, month
        for _ in range(months):
            label = f"{MONTH_LABELS_PT[m]}/{str(y)[2:]}"
            # value in BRL (reais), not cents — for chart display
            cents = rows.get((y, m), 0)
            series.append({"label": label, "value": round(cents / 100, 2), "year": y, "month": m})
            m += 1
            if m == 13:
                m = 1
                y += 1
        return series

    @staticmethod
    def _effective_price_expr():
        return case(
            (AppointmentModel.price_cents.is_not(None), AppointmentModel.price_cents),
            else_=func.coalesce(ServiceModel.price_cents, 0),
        )
