from __future__ import annotations

import re
import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.infrastructure.database.models import ServiceModel, TenantModel


def slugify(value: str) -> str:
    normalized = value.lower().strip()
    normalized = re.sub(r"[^\w\s-]", "", normalized, flags=re.UNICODE)
    normalized = re.sub(r"[\s_-]+", "-", normalized)
    return normalized[:80].strip("-")


class ServiceRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_tenant_by_slug(self, slug: str) -> TenantModel | None:
        stmt = select(TenantModel).where(
            TenantModel.slug == slug,
            TenantModel.is_active.is_(True),
        )
        return self._db.scalar(stmt)

    def list_public_by_tenant_id(self, tenant_id: uuid.UUID) -> list[ServiceModel]:
        stmt = (
            select(ServiceModel)
            .where(
                ServiceModel.tenant_id == tenant_id,
                ServiceModel.is_active.is_(True),
                ServiceModel.deleted_at.is_(None),
            )
            .order_by(ServiceModel.sort_order.asc(), ServiceModel.name.asc())
        )
        return list(self._db.scalars(stmt).all())

    def list_by_tenant(
        self,
        tenant_id: uuid.UUID,
        *,
        include_inactive: bool = False,
    ) -> list[ServiceModel]:
        stmt = select(ServiceModel).where(
            ServiceModel.tenant_id == tenant_id,
            ServiceModel.deleted_at.is_(None),
        )
        if not include_inactive:
            stmt = stmt.where(ServiceModel.is_active.is_(True))
        stmt = stmt.order_by(ServiceModel.sort_order.asc(), ServiceModel.name.asc())
        return list(self._db.scalars(stmt).all())

    def list_all_by_tenant(self, tenant_id: uuid.UUID) -> list[ServiceModel]:
        stmt = (
            select(ServiceModel)
            .where(
                ServiceModel.tenant_id == tenant_id,
                ServiceModel.deleted_at.is_(None),
            )
            .order_by(ServiceModel.sort_order.asc(), ServiceModel.name.asc())
        )
        return list(self._db.scalars(stmt).all())

    def get_by_id(self, tenant_id: uuid.UUID, service_id: uuid.UUID) -> ServiceModel | None:
        stmt = select(ServiceModel).where(
            ServiceModel.id == service_id,
            ServiceModel.tenant_id == tenant_id,
            ServiceModel.deleted_at.is_(None),
        )
        return self._db.scalar(stmt)

    def get_by_slug(self, tenant_id: uuid.UUID, slug: str) -> ServiceModel | None:
        stmt = select(ServiceModel).where(
            ServiceModel.tenant_id == tenant_id,
            ServiceModel.slug == slug,
            ServiceModel.deleted_at.is_(None),
        )
        return self._db.scalar(stmt)

    def create(
        self,
        *,
        tenant_id: uuid.UUID,
        slug: str,
        name: str,
        description: str,
        image_url: str,
        image_alt: str,
        price_cents: int | None,
        duration_minutes: int,
        sort_order: int = 0,
        is_active: bool = True,
    ) -> ServiceModel:
        service = ServiceModel(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            slug=slug,
            name=name,
            description=description,
            image_url=image_url,
            image_alt=image_alt,
            price_cents=price_cents,
            duration_minutes=duration_minutes,
            sort_order=sort_order,
            is_active=is_active,
        )
        self._db.add(service)
        self._db.flush()
        return service

    def save(self, service: ServiceModel) -> ServiceModel:
        self._db.add(service)
        self._db.flush()
        return service

    def soft_delete(self, service: ServiceModel) -> None:
        service.deleted_at = datetime.now(UTC)
        service.is_active = False
        self._db.add(service)
