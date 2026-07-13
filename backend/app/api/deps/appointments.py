from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.appointment_service import AppointmentService
from app.infrastructure.database.session import get_db
from app.infrastructure.repositories.appointment_repository import AppointmentRepository
from app.infrastructure.repositories.client_repository import ClientRepository
from app.infrastructure.repositories.finance_repository import FinanceRepository


def get_appointment_service(db: Annotated[Session, Depends(get_db)]) -> AppointmentService:
    return AppointmentService(
        AppointmentRepository(db),
        FinanceRepository(db),
        ClientRepository(db),
    )
