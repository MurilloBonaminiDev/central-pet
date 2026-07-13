from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps.auth import RequireServiceManager, RequireTenant
from app.api.deps.services import get_catalog_service
from app.api.v1.schemas.services import CreateServiceRequest, UpdateServiceRequest
from app.application.dto.services import ServiceDTO, ServiceListDTO
from app.application.use_cases.catalog_service import CatalogService
from app.domain.exceptions import (
    ConflictError,
    DomainError,
    NotFoundError,
    ValidationError,
)

router = APIRouter(prefix="/services", tags=["services"])


def _http_error(exc: DomainError) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
    if isinstance(exc, ConflictError):
        return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.message)
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)


@router.get("/public/{tenant_slug}", response_model=ServiceListDTO)
def list_public_services(
    tenant_slug: str,
    service: CatalogService = Depends(get_catalog_service),
) -> ServiceListDTO:
    try:
        return service.list_public(tenant_slug)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.get("", response_model=ServiceListDTO)
def list_services(
    principal: RequireTenant,
    include_inactive: bool = Query(default=False),
    service: CatalogService = Depends(get_catalog_service),
) -> ServiceListDTO:
    try:
        return service.list_for_tenant(principal.tenant_id, include_inactive=include_inactive)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.post("", response_model=ServiceDTO, status_code=status.HTTP_201_CREATED)
def create_service(
    body: CreateServiceRequest,
    principal: RequireServiceManager,
    service: CatalogService = Depends(get_catalog_service),
) -> ServiceDTO:
    try:
        return service.create(
            principal.tenant_id,
            name=body.name,
            description=body.description,
            image_url=body.image_url,
            image_alt=body.image_alt,
            price_cents=body.price_cents,
            duration_minutes=body.duration_minutes,
            slug=body.slug,
            sort_order=body.sort_order,
            is_active=body.is_active,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.patch("/{service_id}", response_model=ServiceDTO)
def update_service(
    service_id: str,
    body: UpdateServiceRequest,
    principal: RequireServiceManager,
    service: CatalogService = Depends(get_catalog_service),
) -> ServiceDTO:
    try:
        return service.update(
            principal.tenant_id,
            service_id,
            name=body.name,
            description=body.description,
            image_url=body.image_url,
            image_alt=body.image_alt,
            price_cents=body.price_cents,
            duration_minutes=body.duration_minutes,
            slug=body.slug,
            sort_order=body.sort_order,
            is_active=body.is_active,
            clear_price=body.clear_price,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: str,
    principal: RequireServiceManager,
    service: CatalogService = Depends(get_catalog_service),
) -> None:
    try:
        service.delete(principal.tenant_id, service_id)
    except DomainError as exc:
        raise _http_error(exc) from exc
