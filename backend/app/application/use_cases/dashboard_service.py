from __future__ import annotations

import uuid
from datetime import date

from app.application.dto.dashboard import (
    ChartPointDTO,
    DashboardKpisDTO,
    DashboardStatsDTO,
)
from app.infrastructure.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, repository: DashboardRepository) -> None:
        self._repo = repository

    def get_stats(self, tenant_id: str) -> DashboardStatsDTO:
        tid = uuid.UUID(tenant_id)
        today = date.today()

        kpis = DashboardKpisDTO(
            pending_appointments=self._repo.count_pending(tid),
            today_appointments=self._repo.count_today(tid, today),
            total_clients=self._repo.count_unique_clients(tid),
            completed_services=self._repo.count_completed_services(tid),
            monthly_revenue_cents=self._repo.sum_monthly_revenue_cents(
                tid, today.year, today.month
            ),
        )

        attendances = [
            ChartPointDTO(label=item["label"], value=float(item["value"]))
            for item in self._repo.attendances_by_month(tid, months=12)
        ]
        top_services = [
            ChartPointDTO(label=item["label"], value=float(item["value"]))
            for item in self._repo.top_services(tid, limit=8)
        ]
        revenue = [
            ChartPointDTO(label=item["label"], value=float(item["value"]))
            for item in self._repo.revenue_by_month(tid, months=12)
        ]

        return DashboardStatsDTO(
            kpis=kpis,
            attendances_by_month=attendances,
            top_services=top_services,
            revenue_by_month=revenue,
        )
