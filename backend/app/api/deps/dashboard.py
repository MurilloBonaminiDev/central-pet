from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.dashboard_service import DashboardService
from app.infrastructure.database.session import get_db
from app.infrastructure.repositories.dashboard_repository import DashboardRepository


def get_dashboard_service(db: Annotated[Session, Depends(get_db)]) -> DashboardService:
    return DashboardService(DashboardRepository(db))
