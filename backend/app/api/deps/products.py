from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.catalog_product_service import CatalogProductService
from app.infrastructure.database.session import get_db
from app.infrastructure.repositories.product_repository import ProductRepository


def get_catalog_product_service(
    db: Annotated[Session, Depends(get_db)],
) -> CatalogProductService:
    return CatalogProductService(ProductRepository(db))
