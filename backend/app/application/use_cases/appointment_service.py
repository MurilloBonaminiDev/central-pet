from __future__ import annotations

import uuid
from datetime import date, datetime, time

from app.application.dto.appointments import (
    AppointmentCreateResultDTO,
    AppointmentDTO,
    AppointmentListDTO,
)
from app.domain.exceptions import NotFoundError, ValidationError
from app.domain.ports.inbound_messaging import ChannelBookingIntent
from app.domain.value_objects.appointment_source import (
    APPOINTMENT_SOURCE_WEB,
    APPOINTMENT_SOURCE_WHATSAPP,
    APPOINTMENT_SOURCES,
)
from app.infrastructure.database.models import AppointmentModel
from app.application.use_cases.client_service import ClientService
from app.application.use_cases.finance_service import FinanceService
from app.infrastructure.repositories.appointment_repository import (
    APPOINTMENT_STATUS_COMPLETED,
    APPOINTMENT_STATUS_PENDING,
    PET_SPECIES,
    AppointmentRepository,
)
from app.infrastructure.repositories.client_repository import ClientRepository
from app.infrastructure.repositories.finance_repository import FinanceRepository

SUCCESS_MESSAGE = "Solicitação enviada. Aguarde confirmação da clínica."
CHANNEL_SUCCESS_MESSAGE = "Agendamento recebido pelo canal e registrado na clínica."


class AppointmentService:
    def __init__(
        self,
        repository: AppointmentRepository,
        finance_repository: FinanceRepository | None = None,
        client_repository: ClientRepository | None = None,
    ) -> None:
        self._repo = repository
        self._finance = FinanceService(finance_repository) if finance_repository else None
        self._clients = ClientService(client_repository) if client_repository else None

    @staticmethod
    def _to_dto(appointment: AppointmentModel) -> AppointmentDTO:
        created = appointment.created_at
        created_str = created.isoformat() if isinstance(created, datetime) else str(created)
        return AppointmentDTO(
            id=str(appointment.id),
            client_name=appointment.client_name,
            client_phone=appointment.client_phone,
            client_email=appointment.client_email,
            pet_name=appointment.pet_name,
            pet_species=appointment.pet_species,
            service_id=str(appointment.service_id) if appointment.service_id else None,
            service_name=appointment.service_name,
            desired_date=appointment.desired_date,
            desired_time=appointment.desired_time,
            notes=appointment.notes,
            status=appointment.status,
            source=getattr(appointment, "source", None) or APPOINTMENT_SOURCE_WEB,
            external_message_id=getattr(appointment, "external_message_id", None),
            created_at=created_str,
        )

    def create_public(
        self,
        tenant_slug: str,
        *,
        client_name: str,
        client_phone: str,
        client_email: str,
        pet_name: str,
        pet_species: str,
        service_id: str | None,
        service_name: str | None,
        desired_date: date,
        desired_time: time,
        notes: str | None,
    ) -> AppointmentCreateResultDTO:
        return self._create_for_tenant_slug(
            tenant_slug,
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
            source=APPOINTMENT_SOURCE_WEB,
            external_message_id=None,
            success_message=SUCCESS_MESSAGE,
            require_email=True,
        )

    def create_from_channel(
        self,
        intent: ChannelBookingIntent,
    ) -> AppointmentCreateResultDTO:
        """Create a pending appointment from WhatsApp (or another channel).

        Same persistence path as the public site form so the admin dashboard and
        KPIs pick up the row automatically (status PENDENTE).
        """
        if intent.source not in APPOINTMENT_SOURCES:
            raise ValidationError("Canal de origem inválido")
        if not intent.external_message_id.strip():
            raise ValidationError("external_message_id é obrigatório para canais externos")

        tenant = self._repo.get_tenant_by_slug(intent.tenant_slug.strip())
        if tenant is None:
            raise NotFoundError("Clínica não encontrada")

        existing = self._repo.get_by_external_message_id(
            tenant.id, intent.external_message_id.strip()
        )
        if existing is not None:
            return AppointmentCreateResultDTO(
                appointment=self._to_dto(existing),
                message="Agendamento já registrado (idempotente).",
            )

        email = (intent.client_email or "").strip()
        if not email:
            digits = "".join(ch for ch in intent.client_phone if ch.isdigit())
            email = f"{digits or 'canal'}@whatsapp.centralpet.local"

        return self._create_for_tenant_slug(
            intent.tenant_slug,
            client_name=intent.client_name,
            client_phone=intent.client_phone,
            client_email=email,
            pet_name=intent.pet_name,
            pet_species=intent.pet_species,
            service_id=None,
            service_name=intent.service_name,
            desired_date=intent.desired_date,
            desired_time=intent.desired_time,
            notes=intent.notes,
            source=intent.source or APPOINTMENT_SOURCE_WHATSAPP,
            external_message_id=intent.external_message_id.strip(),
            success_message=CHANNEL_SUCCESS_MESSAGE,
            require_email=False,
        )

    def _create_for_tenant_slug(
        self,
        tenant_slug: str,
        *,
        client_name: str,
        client_phone: str,
        client_email: str,
        pet_name: str,
        pet_species: str,
        service_id: str | None,
        service_name: str | None,
        desired_date: date,
        desired_time: time,
        notes: str | None,
        source: str,
        external_message_id: str | None,
        success_message: str,
        require_email: bool,
    ) -> AppointmentCreateResultDTO:
        tenant = self._repo.get_tenant_by_slug(tenant_slug.strip())
        if tenant is None:
            raise NotFoundError("Clínica não encontrada")

        self._validate(
            client_name=client_name,
            client_phone=client_phone,
            client_email=client_email,
            pet_name=pet_name,
            pet_species=pet_species,
            desired_date=desired_date,
            desired_time=desired_time,
            require_email=require_email,
        )

        resolved_service_id: uuid.UUID | None = None
        resolved_service_name = (service_name or "").strip()
        resolved_price_cents: int | None = None

        if service_id:
            try:
                resolved_service_id = uuid.UUID(service_id)
            except ValueError as exc:
                raise ValidationError("Serviço inválido") from exc
            service = self._repo.get_service(tenant.id, resolved_service_id)
            if service is None:
                raise ValidationError("Serviço não encontrado ou indisponível")
            resolved_service_name = service.name
            resolved_price_cents = service.price_cents

        if not resolved_service_name:
            raise ValidationError("Serviço desejado é obrigatório")

        appointment = self._repo.create(
            tenant_id=tenant.id,
            client_name=client_name.strip(),
            client_phone=client_phone.strip(),
            client_email=client_email.strip().lower(),
            pet_name=pet_name.strip(),
            pet_species=pet_species.strip(),
            service_id=resolved_service_id,
            service_name=resolved_service_name,
            desired_date=desired_date,
            desired_time=desired_time,
            notes=notes.strip() if notes and notes.strip() else None,
            price_cents=resolved_price_cents,
            status=APPOINTMENT_STATUS_PENDING,
            source=source,
            external_message_id=external_message_id,
        )

        if self._clients is not None:
            self._clients.upsert_from_appointment(
                tenant.id,
                client_name=appointment.client_name,
                client_phone=appointment.client_phone,
                client_email=appointment.client_email,
                pet_name=appointment.pet_name,
                pet_species=appointment.pet_species,
                service_name=appointment.service_name,
                occurred_on=appointment.desired_date,
                appointment_id=appointment.id,
                appointment_status=appointment.status,
                notes=appointment.notes,
            )

        return AppointmentCreateResultDTO(
            appointment=self._to_dto(appointment),
            message=success_message,
        )

    def list_for_tenant(self, tenant_id: str, *, status: str | None = None) -> AppointmentListDTO:
        items = self._repo.list_by_tenant(uuid.UUID(tenant_id), status=status)
        return AppointmentListDTO(items=[self._to_dto(item) for item in items])

    def update_status(self, tenant_id: str, appointment_id: str, status: str) -> AppointmentDTO:
        allowed = {
            APPOINTMENT_STATUS_PENDING,
            "CONFIRMADO",
            "CANCELADO",
            "CONCLUIDO",
        }
        if status not in allowed:
            raise ValidationError("Status inválido")
        appointment = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(appointment_id))
        if appointment is None:
            raise NotFoundError("Agendamento não encontrado")
        appointment.status = status
        if status == APPOINTMENT_STATUS_COMPLETED and appointment.price_cents is None and appointment.service_id:
            service = self._repo.get_service(uuid.UUID(tenant_id), appointment.service_id)
            if service is not None:
                appointment.price_cents = service.price_cents
        self._repo.save(appointment)

        if status == APPOINTMENT_STATUS_COMPLETED and self._finance is not None:
            self._finance.record_appointment_income(
                uuid.UUID(tenant_id),
                appointment_id=appointment.id,
                service_name=appointment.service_name,
                amount_cents=appointment.price_cents,
                occurred_on=appointment.desired_date,
                client_name=appointment.client_name,
                pet_name=appointment.pet_name,
            )

        if self._clients is not None:
            self._clients.upsert_from_appointment(
                uuid.UUID(tenant_id),
                client_name=appointment.client_name,
                client_phone=appointment.client_phone,
                client_email=appointment.client_email,
                pet_name=appointment.pet_name,
                pet_species=appointment.pet_species,
                service_name=appointment.service_name,
                occurred_on=appointment.desired_date,
                appointment_id=appointment.id,
                appointment_status=appointment.status,
                notes=appointment.notes,
            )

        return self._to_dto(appointment)

    @staticmethod
    def _validate(
        *,
        client_name: str,
        client_phone: str,
        client_email: str,
        pet_name: str,
        pet_species: str,
        desired_date: date,
        desired_time: time,
        require_email: bool = True,
    ) -> None:
        if not client_name.strip():
            raise ValidationError("Nome do cliente é obrigatório")
        if not client_phone.strip():
            raise ValidationError("Telefone é obrigatório")
        if require_email and (not client_email.strip() or "@" not in client_email):
            raise ValidationError("E-mail inválido")
        if not require_email and client_email.strip() and "@" not in client_email:
            raise ValidationError("E-mail inválido")
        if not pet_name.strip():
            raise ValidationError("Nome do pet é obrigatório")
        if pet_species not in PET_SPECIES:
            raise ValidationError("Espécie inválida")
        if desired_date < date.today():
            raise ValidationError("A data desejada não pode ser no passado")
        _ = desired_time  # validated by schema parsing
