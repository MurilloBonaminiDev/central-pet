from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.finance_service import FinanceService
from app.infrastructure.database.session import get_db
from app.infrastructure.repositories.finance_repository import FinanceRepository


def get_finance_service(db: Annotated[Session, Depends(get_db)]) -> FinanceService:
    return FinanceService(FinanceRepository(db))
