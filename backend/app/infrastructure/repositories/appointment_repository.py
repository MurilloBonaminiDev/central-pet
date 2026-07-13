from __future__ import annotations

import uuid
from datetime import date, time

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.infrastructure.database.models import AppointmentModel, ServiceModel, TenantModel

APPOINTMENT_STATUS_PENDING = "PENDENTE"
APPOINTMENT_STATUS_CONFIRMED = "CONFIRMADO"
APPOINTMENT_STATUS_CANCELLED = "CANCELADO"
APPOINTMENT_STATUS_COMPLETED = "CONCLUIDO"

PET_SPECIES = ("Cão", "Gato", "Ave", "Outro")
MONTH_LABELS_PT = (
    "",
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
)


class AppointmentRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_tenant_by_slug(self, slug: str) -> TenantModel | None:
        stmt = select(TenantModel).where(
            TenantModel.slug == slug,
            TenantModel.is_active.is_(True),
        )
        return self._db.scalar(stmt)

    def get_service(self, tenant_id: uuid.UUID, service_id: uuid.UUID) -> ServiceModel | None:
        stmt = select(ServiceModel).where(
            ServiceModel.id == service_id,
            ServiceModel.tenant_id == tenant_id,
            ServiceModel.deleted_at.is_(None),
            ServiceModel.is_active.is_(True),
        )
        return self._db.scalar(stmt)

    def create(
        self,
        *,
        tenant_id: uuid.UUID,
        client_name: str,
        client_phone: str,
        client_email: str,
        pet_name: str,
        pet_species: str,
        service_id: uuid.UUID | None,
        service_name: str,
        desired_date: date,
        desired_time: time,
        notes: str | None,
        price_cents: int | None = None,
        status: str = APPOINTMENT_STATUS_PENDING,
        source: str = "WEB",
        external_message_id: str | None = None,
    ) -> AppointmentModel:
        appointment = AppointmentModel(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            client_name=client_name,
            client_phone=client_phone,
            client_email=client_email,
            pet_name=pet_name,
            pet_species=pet_species,
            service_id=service_id,
            service_name=service_name,
            desired_date=desired_date,
            desired_time=desired_time,
            notes=notes,
            price_cents=price_cents,
            status=status,
            source=source,
            external_message_id=external_message_id,
        )
        self._db.add(appointment)
        self._db.commit()
        self._db.refresh(appointment)
        return appointment

    def get_by_external_message_id(
        self,
        tenant_id: uuid.UUID,
        external_message_id: str,
    ) -> AppointmentModel | None:
        stmt = select(AppointmentModel).where(
            AppointmentModel.tenant_id == tenant_id,
            AppointmentModel.external_message_id == external_message_id,
        )
        return self._db.scalar(stmt)

    def list_by_tenant(
        self,
        tenant_id: uuid.UUID,
        *,
        status: str | None = None,
    ) -> list[AppointmentModel]:
        stmt = select(AppointmentModel).where(AppointmentModel.tenant_id == tenant_id)
        if status:
            stmt = stmt.where(AppointmentModel.status == status)
        stmt = stmt.order_by(
            AppointmentModel.desired_date.asc(),
            AppointmentModel.desired_time.asc(),
            AppointmentModel.created_at.desc(),
        )
        return list(self._db.scalars(stmt).all())

    def get_by_id(self, tenant_id: uuid.UUID, appointment_id: uuid.UUID) -> AppointmentModel | None:
        stmt = select(AppointmentModel).where(
            AppointmentModel.id == appointment_id,
            AppointmentModel.tenant_id == tenant_id,
        )
        return self._db.scalar(stmt)

    def save(self, appointment: AppointmentModel) -> AppointmentModel:
        self._db.add(appointment)
        self._db.commit()
        self._db.refresh(appointment)
        return appointment
