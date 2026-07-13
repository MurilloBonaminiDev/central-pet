from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.infrastructure.database.models import ProductModel, TenantModel
from app.infrastructure.repositories.service_repository import slugify


PRODUCT_CATEGORIES = (
    "Rações",
    "Medicamentos",
    "Brinquedos",
    "Acessórios",
    "Higiene",
)


class ProductRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_tenant_by_slug(self, slug: str) -> TenantModel | None:
        stmt = select(TenantModel).where(
            TenantModel.slug == slug,
            TenantModel.is_active.is_(True),
        )
        return self._db.scalar(stmt)

    def list_public_by_tenant_id(
        self,
        tenant_id: uuid.UUID,
        *,
        category: str | None = None,
    ) -> list[ProductModel]:
        stmt = select(ProductModel).where(
            ProductModel.tenant_id == tenant_id,
            ProductModel.is_active.is_(True),
            ProductModel.deleted_at.is_(None),
        )
        if category:
            stmt = stmt.where(ProductModel.category == category)
        stmt = stmt.order_by(ProductModel.sort_order.asc(), ProductModel.name.asc())
        return list(self._db.scalars(stmt).all())

    def list_by_tenant(
        self,
        tenant_id: uuid.UUID,
        *,
        include_inactive: bool = False,
        category: str | None = None,
    ) -> list[ProductModel]:
        stmt = select(ProductModel).where(
            ProductModel.tenant_id == tenant_id,
            ProductModel.deleted_at.is_(None),
        )
        if not include_inactive:
            stmt = stmt.where(ProductModel.is_active.is_(True))
        if category:
            stmt = stmt.where(ProductModel.category == category)
        stmt = stmt.order_by(ProductModel.sort_order.asc(), ProductModel.name.asc())
        return list(self._db.scalars(stmt).all())

    def get_by_id(self, tenant_id: uuid.UUID, product_id: uuid.UUID) -> ProductModel | None:
        stmt = select(ProductModel).where(
            ProductModel.id == product_id,
            ProductModel.tenant_id == tenant_id,
            ProductModel.deleted_at.is_(None),
        )
        return self._db.scalar(stmt)

    def get_by_slug(self, tenant_id: uuid.UUID, slug: str) -> ProductModel | None:
        stmt = select(ProductModel).where(
            ProductModel.tenant_id == tenant_id,
            ProductModel.slug == slug,
            ProductModel.deleted_at.is_(None),
        )
        return self._db.scalar(stmt)

    def create(
        self,
        *,
        tenant_id: uuid.UUID,
        slug: str,
        name: str,
        description: str,
        category: str,
        image_url: str,
        image_alt: str,
        price_cents: int,
        sort_order: int = 0,
        is_active: bool = True,
    ) -> ProductModel:
        product = ProductModel(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            slug=slug,
            name=name,
            description=description,
            category=category,
            image_url=image_url,
            image_alt=image_alt,
            price_cents=price_cents,
            sort_order=sort_order,
            is_active=is_active,
        )
        self._db.add(product)
        self._db.flush()
        return product

    def save(self, product: ProductModel) -> ProductModel:
        self._db.add(product)
        self._db.flush()
        return product

    def soft_delete(self, product: ProductModel) -> None:
        product.deleted_at = datetime.now(UTC)
        product.is_active = False
        self._db.add(product)


__all__ = ["ProductRepository", "PRODUCT_CATEGORIES", "slugify"]
