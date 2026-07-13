from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.api.deps.auth import RequireTenant
from app.api.deps.clients import get_client_service
from app.api.v1.schemas.clients import (
    CreateClientRequest,
    CreateHistoryRequest,
    CreatePetRequest,
    UpdateClientRequest,
    UpdatePetRequest,
)
from app.application.dto.clients import (
    ClientDetailDTO,
    ClientHistoryDTO,
    ClientListDTO,
    ImportClientsResultDTO,
    PetDTO,
)
from app.application.use_cases.client_service import ClientService
from app.domain.exceptions import ConflictError, DomainError, NotFoundError, ValidationError

router = APIRouter(prefix="/clients", tags=["clients"])


def _http_error(exc: DomainError) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
    if isinstance(exc, ConflictError):
        return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.message)
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)


@router.get("", response_model=ClientListDTO)
def list_clients(
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
    q: Annotated[str | None, Query()] = None,
) -> ClientListDTO:
    assert principal.tenant_id is not None
    try:
        return service.list_clients(principal.tenant_id, q=q)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.post("/import-appointments", response_model=ImportClientsResultDTO)
def import_clients_from_appointments(
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> ImportClientsResultDTO:
    assert principal.tenant_id is not None
    try:
        return service.import_from_appointments(principal.tenant_id)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.post("", response_model=ClientDetailDTO, status_code=status.HTTP_201_CREATED)
def create_client(
    body: CreateClientRequest,
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> ClientDetailDTO:
    assert principal.tenant_id is not None
    try:
        return service.create_client(
            principal.tenant_id,
            name=body.name,
            phone=body.phone,
            email=body.email,
            notes=body.notes,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.get("/{client_id}", response_model=ClientDetailDTO)
def get_client(
    client_id: str,
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> ClientDetailDTO:
    assert principal.tenant_id is not None
    try:
        return service.get_client(principal.tenant_id, client_id)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.patch("/{client_id}", response_model=ClientDetailDTO)
def update_client(
    client_id: str,
    body: UpdateClientRequest,
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> ClientDetailDTO:
    assert principal.tenant_id is not None
    try:
        return service.update_client(
            principal.tenant_id,
            client_id,
            name=body.name,
            phone=body.phone,
            email=body.email,
            notes=body.notes,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: str,
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> Response:
    assert principal.tenant_id is not None
    try:
        service.delete_client(principal.tenant_id, client_id)
    except DomainError as exc:
        raise _http_error(exc) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{client_id}/pets",
    response_model=PetDTO,
    status_code=status.HTTP_201_CREATED,
)
def create_pet(
    client_id: str,
    body: CreatePetRequest,
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> PetDTO:
    assert principal.tenant_id is not None
    try:
        return service.create_pet(
            principal.tenant_id,
            client_id,
            name=body.name,
            species=body.species,
            breed=body.breed,
            age_years=body.age_years,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.patch("/{client_id}/pets/{pet_id}", response_model=PetDTO)
def update_pet(
    client_id: str,
    pet_id: str,
    body: UpdatePetRequest,
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> PetDTO:
    assert principal.tenant_id is not None
    try:
        return service.update_pet(
            principal.tenant_id,
            client_id,
            pet_id,
            name=body.name,
            species=body.species,
            breed=body.breed,
            age_years=body.age_years,
            clear_age=body.clear_age,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.delete("/{client_id}/pets/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pet(
    client_id: str,
    pet_id: str,
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> Response:
    assert principal.tenant_id is not None
    try:
        service.delete_pet(principal.tenant_id, client_id, pet_id)
    except DomainError as exc:
        raise _http_error(exc) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{client_id}/history",
    response_model=ClientHistoryDTO,
    status_code=status.HTTP_201_CREATED,
)
def create_history(
    client_id: str,
    body: CreateHistoryRequest,
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> ClientHistoryDTO:
    assert principal.tenant_id is not None
    try:
        return service.create_history(
            principal.tenant_id,
            client_id,
            entry_type=body.entry_type,
            title=body.title,
            occurred_on=body.occurred_on,
            description=body.description,
            pet_id=body.pet_id,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.delete(
    "/{client_id}/history/{history_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_history(
    client_id: str,
    history_id: str,
    principal: RequireTenant,
    service: Annotated[ClientService, Depends(get_client_service)],
) -> Response:
    assert principal.tenant_id is not None
    try:
        service.delete_history(principal.tenant_id, client_id, history_id)
    except DomainError as exc:
        raise _http_error(exc) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)
