from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps.appointments import get_appointment_service
from app.api.deps.auth import RequireServiceManager, RequireTenant
from app.api.v1.schemas.appointments import (
    CreateAppointmentRequest,
    UpdateAppointmentStatusRequest,
)
from app.application.dto.appointments import (
    AppointmentCreateResultDTO,
    AppointmentDTO,
    AppointmentListDTO,
)
from app.application.use_cases.appointment_service import AppointmentService
from app.domain.exceptions import (
    ConflictError,
    DomainError,
    NotFoundError,
    ValidationError,
)

router = APIRouter(prefix="/appointments", tags=["appointments"])


def _http_error(exc: DomainError) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
    if isinstance(exc, ConflictError):
        return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.message)
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)


@router.post(
    "/public/{tenant_slug}",
    response_model=AppointmentCreateResultDTO,
    status_code=status.HTTP_201_CREATED,
)
def create_public_appointment(
    tenant_slug: str,
    body: CreateAppointmentRequest,
    service: AppointmentService = Depends(get_appointment_service),
) -> AppointmentCreateResultDTO:
    try:
        return service.create_public(
            tenant_slug,
            client_name=body.client_name,
            client_phone=body.client_phone,
            client_email=str(body.client_email),
            pet_name=body.pet_name,
            pet_species=body.pet_species,
            service_id=body.service_id,
            service_name=body.service_name,
            desired_date=body.desired_date,
            desired_time=body.desired_time,
            notes=body.notes,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.get("", response_model=AppointmentListDTO)
def list_appointments(
    principal: RequireTenant,
    status_filter: str | None = Query(default=None, alias="status"),
    service: AppointmentService = Depends(get_appointment_service),
) -> AppointmentListDTO:
    """Lista agendamentos do tenant — usado pela dashboard administrativa."""
    try:
        return service.list_for_tenant(principal.tenant_id, status=status_filter)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.patch("/{appointment_id}/status", response_model=AppointmentDTO)
def update_appointment_status(
    appointment_id: str,
    body: UpdateAppointmentStatusRequest,
    principal: RequireServiceManager,
    service: AppointmentService = Depends(get_appointment_service),
) -> AppointmentDTO:
    """Atualiza status do agendamento (dashboard administrativa)."""
    try:
        return service.update_status(principal.tenant_id, appointment_id, body.status)
    except DomainError as exc:
        raise _http_error(exc) from exc
