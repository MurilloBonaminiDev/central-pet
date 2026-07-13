from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.catalog_service import CatalogService
from app.infrastructure.database.session import get_db
from app.infrastructure.repositories.service_repository import ServiceRepository


def get_catalog_service(db: Annotated[Session, Depends(get_db)]) -> CatalogService:
    return CatalogService(ServiceRepository(db))
