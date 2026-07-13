from __future__ import annotations

from pydantic import BaseModel, Field


class ChartPointDTO(BaseModel):
    label: str
    value: float


class DashboardKpisDTO(BaseModel):
    pending_appointments: int
    today_appointments: int
    total_clients: int
    completed_services: int
    monthly_revenue_cents: int


class DashboardStatsDTO(BaseModel):
    kpis: DashboardKpisDTO
    attendances_by_month: list[ChartPointDTO] = Field(default_factory=list)
    top_services: list[ChartPointDTO] = Field(default_factory=list)
    revenue_by_month: list[ChartPointDTO] = Field(default_factory=list)
