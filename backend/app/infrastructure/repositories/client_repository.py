from __future__ import annotations

import uuid
from datetime import UTC, date, datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.infrastructure.database.models import (
    AppointmentModel,
    ClientHistoryModel,
    ClientModel,
    PetModel,
)

HISTORY_CONSULTA = "CONSULTA"
HISTORY_SERVICO = "SERVICO"
HISTORY_VACINA = "VACINA"
HISTORY_OBSERVACAO = "OBSERVACAO"

HISTORY_TYPES = (HISTORY_CONSULTA, HISTORY_SERVICO, HISTORY_VACINA, HISTORY_OBSERVACAO)

HISTORY_LABELS = {
    HISTORY_CONSULTA: "Consultas",
    HISTORY_SERVICO: "Serviços realizados",
    HISTORY_VACINA: "Vacinas",
    HISTORY_OBSERVACAO: "Observações",
}


def infer_history_type(service_name: str) -> str:
    name = service_name.casefold()
    if "vacina" in name or "vacinação" in name or "vacinacao" in name:
        return HISTORY_VACINA
    if "consulta" in name or "clínico" in name or "clinico" in name or "veterin" in name:
        return HISTORY_CONSULTA
    return HISTORY_SERVICO


class ClientRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def list(self, tenant_id: uuid.UUID, *, q: str | None = None) -> list[ClientModel]:
        stmt = (
            select(ClientModel)
            .options(selectinload(ClientModel.pets))
            .where(
                ClientModel.tenant_id == tenant_id,
                ClientModel.deleted_at.is_(None),
            )
            .order_by(ClientModel.name.asc())
        )
        if q:
            like = f"%{q.strip()}%"
            stmt = stmt.where(
                (ClientModel.name.ilike(like))
                | (ClientModel.email.ilike(like))
                | (ClientModel.phone.ilike(like))
            )
        return list(self._db.scalars(stmt).unique().all())

    def get_by_id(self, tenant_id: uuid.UUID, client_id: uuid.UUID) -> ClientModel | None:
        stmt = (
            select(ClientModel)
            .options(
                selectinload(ClientModel.pets),
                selectinload(ClientModel.history_entries).selectinload(ClientHistoryModel.pet),
            )
            .where(
                ClientModel.id == client_id,
                ClientModel.tenant_id == tenant_id,
                ClientModel.deleted_at.is_(None),
            )
        )
        return self._db.scalars(stmt).first()

    def get_by_email(self, tenant_id: uuid.UUID, email: str) -> ClientModel | None:
        stmt = select(ClientModel).where(
            ClientModel.tenant_id == tenant_id,
            ClientModel.email == email.strip().lower(),
            ClientModel.deleted_at.is_(None),
        )
        return self._db.scalars(stmt).first()

    def create(
        self,
        *,
        tenant_id: uuid.UUID,
        name: str,
        phone: str,
        email: str,
        notes: str | None = None,
    ) -> ClientModel:
        row = ClientModel(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            name=name.strip(),
            phone=phone.strip(),
            email=email.strip().lower(),
            notes=notes.strip() if notes else None,
        )
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        return row

    def save(self, row: ClientModel) -> ClientModel:
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        return row

    def soft_delete(self, row: ClientModel) -> None:
        row.deleted_at = datetime.now(UTC)
        self._db.add(row)
        self._db.commit()

    def count_pets(self, client_id: uuid.UUID) -> int:
        stmt = select(func.count()).select_from(PetModel).where(
            PetModel.client_id == client_id,
            PetModel.deleted_at.is_(None),
        )
        return int(self._db.scalar(stmt) or 0)

    def get_pet(self, tenant_id: uuid.UUID, pet_id: uuid.UUID) -> PetModel | None:
        stmt = select(PetModel).where(
            PetModel.id == pet_id,
            PetModel.tenant_id == tenant_id,
            PetModel.deleted_at.is_(None),
        )
        return self._db.scalars(stmt).first()

    def find_pet(
        self,
        client_id: uuid.UUID,
        *,
        name: str,
        species: str,
    ) -> PetModel | None:
        stmt = select(PetModel).where(
            PetModel.client_id == client_id,
            PetModel.name == name.strip(),
            PetModel.species == species.strip(),
            PetModel.deleted_at.is_(None),
        )
        return self._db.scalars(stmt).first()

    def create_pet(
        self,
        *,
        tenant_id: uuid.UUID,
        client_id: uuid.UUID,
        name: str,
        species: str,
        breed: str = "",
        age_years: int | None = None,
    ) -> PetModel:
        row = PetModel(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            client_id=client_id,
            name=name.strip(),
            species=species.strip(),
            breed=(breed or "").strip(),
            age_years=age_years,
        )
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        return row

    def save_pet(self, row: PetModel) -> PetModel:
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        return row

    def soft_delete_pet(self, row: PetModel) -> None:
        row.deleted_at = datetime.now(UTC)
        self._db.add(row)
        self._db.commit()

    def list_history(
        self,
        client_id: uuid.UUID,
        *,
        entry_type: str | None = None,
    ) -> list[ClientHistoryModel]:
        stmt = (
            select(ClientHistoryModel)
            .options(selectinload(ClientHistoryModel.pet))
            .where(
                ClientHistoryModel.client_id == client_id,
                ClientHistoryModel.deleted_at.is_(None),
            )
            .order_by(
                ClientHistoryModel.occurred_on.desc(),
                ClientHistoryModel.created_at.desc(),
            )
        )
        if entry_type:
            stmt = stmt.where(ClientHistoryModel.entry_type == entry_type)
        return list(self._db.scalars(stmt).all())

    def get_history(
        self, tenant_id: uuid.UUID, history_id: uuid.UUID
    ) -> ClientHistoryModel | None:
        stmt = (
            select(ClientHistoryModel)
            .options(selectinload(ClientHistoryModel.pet))
            .where(
                ClientHistoryModel.id == history_id,
                ClientHistoryModel.tenant_id == tenant_id,
                ClientHistoryModel.deleted_at.is_(None),
            )
        )
        return self._db.scalars(stmt).first()

    def get_history_by_appointment(
        self, tenant_id: uuid.UUID, appointment_id: uuid.UUID
    ) -> ClientHistoryModel | None:
        stmt = select(ClientHistoryModel).where(
            ClientHistoryModel.tenant_id == tenant_id,
            ClientHistoryModel.appointment_id == appointment_id,
            ClientHistoryModel.deleted_at.is_(None),
        )
        return self._db.scalars(stmt).first()

    def create_history(
        self,
        *,
        tenant_id: uuid.UUID,
        client_id: uuid.UUID,
        entry_type: str,
        title: str,
        occurred_on: date,
        description: str | None = None,
        pet_id: uuid.UUID | None = None,
        appointment_id: uuid.UUID | None = None,
    ) -> ClientHistoryModel:
        row = ClientHistoryModel(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            client_id=client_id,
            pet_id=pet_id,
            entry_type=entry_type,
            title=title.strip(),
            description=description.strip() if description else None,
            occurred_on=occurred_on,
            appointment_id=appointment_id,
        )
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        return row

    def save_history(self, row: ClientHistoryModel) -> ClientHistoryModel:
        self._db.add(row)
        self._db.commit()
        self._db.refresh(row)
        return row

    def soft_delete_history(self, row: ClientHistoryModel) -> None:
        row.deleted_at = datetime.now(UTC)
        self._db.add(row)
        self._db.commit()

    def list_appointments(self, tenant_id: uuid.UUID) -> list[AppointmentModel]:
        stmt = (
            select(AppointmentModel)
            .where(AppointmentModel.tenant_id == tenant_id)
            .order_by(AppointmentModel.desired_date.desc())
        )
        return list(self._db.scalars(stmt).all())
