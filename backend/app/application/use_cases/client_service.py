from __future__ import annotations

import uuid
from datetime import date, datetime

from app.application.dto.clients import (
    ClientDetailDTO,
    ClientHistoryDTO,
    ClientListDTO,
    ClientListItemDTO,
    ImportClientsResultDTO,
    PetDTO,
)
from app.domain.exceptions import ConflictError, NotFoundError, ValidationError
from app.infrastructure.database.models import ClientHistoryModel, ClientModel, PetModel
from app.infrastructure.repositories.appointment_repository import (
    APPOINTMENT_STATUS_COMPLETED,
    PET_SPECIES,
)
from app.infrastructure.repositories.client_repository import (
    HISTORY_LABELS,
    HISTORY_TYPES,
    ClientRepository,
    infer_history_type,
)


class ClientService:
    def __init__(self, repository: ClientRepository) -> None:
        self._repo = repository

    @staticmethod
    def _ts(value: datetime | str) -> str:
        if isinstance(value, datetime):
            return value.isoformat()
        return str(value)

    def _pet_dto(self, pet: PetModel) -> PetDTO:
        return PetDTO(
            id=str(pet.id),
            name=pet.name,
            species=pet.species,
            breed=pet.breed or "",
            age_years=pet.age_years,
            created_at=self._ts(pet.created_at),
        )

    def _history_dto(self, row: ClientHistoryModel) -> ClientHistoryDTO:
        return ClientHistoryDTO(
            id=str(row.id),
            entry_type=row.entry_type,
            entry_type_label=HISTORY_LABELS.get(row.entry_type, row.entry_type),
            title=row.title,
            description=row.description,
            occurred_on=row.occurred_on,
            pet_id=str(row.pet_id) if row.pet_id else None,
            pet_name=row.pet.name if row.pet else None,
            appointment_id=str(row.appointment_id) if row.appointment_id else None,
            created_at=self._ts(row.created_at),
        )

    def list_clients(self, tenant_id: str, *, q: str | None = None) -> ClientListDTO:
        items = self._repo.list(uuid.UUID(tenant_id), q=q)
        return ClientListDTO(
            items=[
                ClientListItemDTO(
                    id=str(c.id),
                    name=c.name,
                    phone=c.phone,
                    email=c.email,
                    pets_count=len([p for p in c.pets if p.deleted_at is None]),
                    created_at=self._ts(c.created_at),
                )
                for c in items
            ]
        )

    def get_client(self, tenant_id: str, client_id: str) -> ClientDetailDTO:
        client = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(client_id))
        if client is None:
            raise NotFoundError("Cliente não encontrado")
        pets = [self._pet_dto(p) for p in client.pets if p.deleted_at is None]
        history = [
            self._history_dto(h)
            for h in sorted(
                [h for h in client.history_entries if h.deleted_at is None],
                key=lambda x: (x.occurred_on, x.created_at),
                reverse=True,
            )
        ]
        return ClientDetailDTO(
            id=str(client.id),
            name=client.name,
            phone=client.phone,
            email=client.email,
            notes=client.notes,
            pets=pets,
            history=history,
            created_at=self._ts(client.created_at),
        )

    def create_client(
        self,
        tenant_id: str,
        *,
        name: str,
        phone: str,
        email: str,
        notes: str | None = None,
    ) -> ClientDetailDTO:
        self._validate_client(name=name, phone=phone, email=email)
        tid = uuid.UUID(tenant_id)
        existing = self._repo.get_by_email(tid, email)
        if existing is not None:
            raise ConflictError("Já existe um cliente com este e-mail")
        client = self._repo.create(
            tenant_id=tid,
            name=name,
            phone=phone,
            email=email,
            notes=notes,
        )
        return self.get_client(tenant_id, str(client.id))

    def update_client(
        self,
        tenant_id: str,
        client_id: str,
        *,
        name: str | None = None,
        phone: str | None = None,
        email: str | None = None,
        notes: str | None = None,
    ) -> ClientDetailDTO:
        client = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(client_id))
        if client is None:
            raise NotFoundError("Cliente não encontrado")

        next_name = name if name is not None else client.name
        next_phone = phone if phone is not None else client.phone
        next_email = email if email is not None else client.email
        self._validate_client(name=next_name, phone=next_phone, email=next_email)

        if email is not None and email.strip().lower() != client.email:
            conflict = self._repo.get_by_email(uuid.UUID(tenant_id), email)
            if conflict is not None and conflict.id != client.id:
                raise ConflictError("Já existe um cliente com este e-mail")
            client.email = email.strip().lower()

        if name is not None:
            client.name = name.strip()
        if phone is not None:
            client.phone = phone.strip()
        if notes is not None:
            client.notes = notes.strip() or None

        self._repo.save(client)
        return self.get_client(tenant_id, client_id)

    def delete_client(self, tenant_id: str, client_id: str) -> None:
        client = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(client_id))
        if client is None:
            raise NotFoundError("Cliente não encontrado")
        self._repo.soft_delete(client)

    def create_pet(
        self,
        tenant_id: str,
        client_id: str,
        *,
        name: str,
        species: str,
        breed: str = "",
        age_years: int | None = None,
    ) -> PetDTO:
        client = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(client_id))
        if client is None:
            raise NotFoundError("Cliente não encontrado")
        self._validate_pet(name=name, species=species, age_years=age_years)
        pet = self._repo.create_pet(
            tenant_id=uuid.UUID(tenant_id),
            client_id=client.id,
            name=name,
            species=species,
            breed=breed,
            age_years=age_years,
        )
        return self._pet_dto(pet)

    def update_pet(
        self,
        tenant_id: str,
        client_id: str,
        pet_id: str,
        *,
        name: str | None = None,
        species: str | None = None,
        breed: str | None = None,
        age_years: int | None = None,
        clear_age: bool = False,
    ) -> PetDTO:
        client = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(client_id))
        if client is None:
            raise NotFoundError("Cliente não encontrado")
        pet = self._repo.get_pet(uuid.UUID(tenant_id), uuid.UUID(pet_id))
        if pet is None or pet.client_id != client.id:
            raise NotFoundError("Pet não encontrado")

        next_name = name if name is not None else pet.name
        next_species = species if species is not None else pet.species
        next_age = None if clear_age else (age_years if age_years is not None else pet.age_years)
        self._validate_pet(name=next_name, species=next_species, age_years=next_age)

        if name is not None:
            pet.name = name.strip()
        if species is not None:
            pet.species = species.strip()
        if breed is not None:
            pet.breed = breed.strip()
        if clear_age:
            pet.age_years = None
        elif age_years is not None:
            pet.age_years = age_years

        self._repo.save_pet(pet)
        return self._pet_dto(pet)

    def delete_pet(self, tenant_id: str, client_id: str, pet_id: str) -> None:
        client = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(client_id))
        if client is None:
            raise NotFoundError("Cliente não encontrado")
        pet = self._repo.get_pet(uuid.UUID(tenant_id), uuid.UUID(pet_id))
        if pet is None or pet.client_id != client.id:
            raise NotFoundError("Pet não encontrado")
        self._repo.soft_delete_pet(pet)

    def create_history(
        self,
        tenant_id: str,
        client_id: str,
        *,
        entry_type: str,
        title: str,
        occurred_on: date,
        description: str | None = None,
        pet_id: str | None = None,
    ) -> ClientHistoryDTO:
        client = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(client_id))
        if client is None:
            raise NotFoundError("Cliente não encontrado")
        self._validate_history(entry_type=entry_type, title=title)

        resolved_pet_id: uuid.UUID | None = None
        if pet_id:
            pet = self._repo.get_pet(uuid.UUID(tenant_id), uuid.UUID(pet_id))
            if pet is None or pet.client_id != client.id:
                raise NotFoundError("Pet não encontrado")
            resolved_pet_id = pet.id

        row = self._repo.create_history(
            tenant_id=uuid.UUID(tenant_id),
            client_id=client.id,
            entry_type=entry_type,
            title=title,
            occurred_on=occurred_on,
            description=description,
            pet_id=resolved_pet_id,
        )
        # reload with pet relationship
        loaded = self._repo.get_history(uuid.UUID(tenant_id), row.id)
        assert loaded is not None
        return self._history_dto(loaded)

    def delete_history(self, tenant_id: str, client_id: str, history_id: str) -> None:
        client = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(client_id))
        if client is None:
            raise NotFoundError("Cliente não encontrado")
        row = self._repo.get_history(uuid.UUID(tenant_id), uuid.UUID(history_id))
        if row is None or row.client_id != client.id:
            raise NotFoundError("Registro de histórico não encontrado")
        self._repo.soft_delete_history(row)

    def upsert_from_appointment(
        self,
        tenant_id: uuid.UUID,
        *,
        client_name: str,
        client_phone: str,
        client_email: str,
        pet_name: str,
        pet_species: str,
        service_name: str,
        occurred_on: date,
        appointment_id: uuid.UUID,
        appointment_status: str,
        notes: str | None = None,
    ) -> None:
        """Create/update client + pet; record history when appointment is completed."""
        client = self._repo.get_by_email(tenant_id, client_email)
        if client is None:
            client = self._repo.create(
                tenant_id=tenant_id,
                name=client_name,
                phone=client_phone,
                email=client_email,
            )
        else:
            client.name = client_name.strip()
            client.phone = client_phone.strip()
            self._repo.save(client)

        pet = self._repo.find_pet(client.id, name=pet_name, species=pet_species)
        if pet is None:
            pet = self._repo.create_pet(
                tenant_id=tenant_id,
                client_id=client.id,
                name=pet_name,
                species=pet_species,
                breed="",
            )

        if appointment_status != APPOINTMENT_STATUS_COMPLETED:
            return

        existing = self._repo.get_history_by_appointment(tenant_id, appointment_id)
        if existing is not None:
            return

        entry_type = infer_history_type(service_name)
        description_parts = [f"Serviço: {service_name}"]
        if notes:
            description_parts.append(notes)
        self._repo.create_history(
            tenant_id=tenant_id,
            client_id=client.id,
            pet_id=pet.id,
            entry_type=entry_type,
            title=service_name,
            occurred_on=occurred_on,
            description="\n".join(description_parts),
            appointment_id=appointment_id,
        )

    def import_from_appointments(self, tenant_id: str) -> ImportClientsResultDTO:
        tid = uuid.UUID(tenant_id)
        appointments = self._repo.list_appointments(tid)
        clients_before = {c.email for c in self._repo.list(tid)}
        pets_created = 0
        history_created = 0
        clients_created = 0

        for appt in appointments:
            email = appt.client_email.strip().lower()
            existed = email in clients_before
            client = self._repo.get_by_email(tid, email)
            if client is None:
                client = self._repo.create(
                    tenant_id=tid,
                    name=appt.client_name,
                    phone=appt.client_phone,
                    email=email,
                )
                clients_created += 1
                clients_before.add(email)
            elif not existed:
                pass

            pet = self._repo.find_pet(client.id, name=appt.pet_name, species=appt.pet_species)
            if pet is None:
                pet = self._repo.create_pet(
                    tenant_id=tid,
                    client_id=client.id,
                    name=appt.pet_name,
                    species=appt.pet_species,
                )
                pets_created += 1

            if appt.status != APPOINTMENT_STATUS_COMPLETED:
                continue
            existing = self._repo.get_history_by_appointment(tid, appt.id)
            if existing is not None:
                continue
            self._repo.create_history(
                tenant_id=tid,
                client_id=client.id,
                pet_id=pet.id,
                entry_type=infer_history_type(appt.service_name),
                title=appt.service_name,
                occurred_on=appt.desired_date,
                description=f"Serviço: {appt.service_name}"
                + (f"\n{appt.notes}" if appt.notes else ""),
                appointment_id=appt.id,
            )
            history_created += 1

        return ImportClientsResultDTO(
            clients_created=clients_created,
            pets_created=pets_created,
            history_created=history_created,
        )

    @staticmethod
    def _validate_client(*, name: str, phone: str, email: str) -> None:
        if not name.strip():
            raise ValidationError("Nome é obrigatório")
        if not phone.strip():
            raise ValidationError("Telefone é obrigatório")
        if not email.strip() or "@" not in email:
            raise ValidationError("E-mail inválido")

    @staticmethod
    def _validate_pet(*, name: str, species: str, age_years: int | None) -> None:
        if not name.strip():
            raise ValidationError("Nome do pet é obrigatório")
        if species.strip() not in PET_SPECIES:
            raise ValidationError("Espécie inválida")
        if age_years is not None and (age_years < 0 or age_years > 40):
            raise ValidationError("Idade inválida")

    @staticmethod
    def _validate_history(*, entry_type: str, title: str) -> None:
        if entry_type not in HISTORY_TYPES:
            raise ValidationError("Tipo de histórico inválido")
        if not title.strip():
            raise ValidationError("Título é obrigatório")
