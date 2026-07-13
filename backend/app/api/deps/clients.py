from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.client_service import ClientService
from app.infrastructure.database.session import get_db
from app.infrastructure.repositories.client_repository import ClientRepository


def get_client_service(db: Annotated[Session, Depends(get_db)]) -> ClientService:
    return ClientService(ClientRepository(db))
