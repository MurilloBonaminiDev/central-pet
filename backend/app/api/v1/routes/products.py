from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.deps.auth import RequireServiceManager, RequireTenant
from app.api.deps.products import get_catalog_product_service
from app.api.v1.schemas.products import CreateProductRequest, UpdateProductRequest
from app.application.dto.products import ProductDTO, ProductListDTO
from app.application.use_cases.catalog_product_service import CatalogProductService
from app.domain.exceptions import (
    ConflictError,
    DomainError,
    NotFoundError,
    ValidationError,
)

router = APIRouter(prefix="/products", tags=["products"])


def _http_error(exc: DomainError) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
    if isinstance(exc, ConflictError):
        return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=exc.message)
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)


@router.get("/public/{tenant_slug}", response_model=ProductListDTO)
def list_public_products(
    tenant_slug: str,
    category: str | None = Query(default=None),
    service: CatalogProductService = Depends(get_catalog_product_service),
) -> ProductListDTO:
    try:
        return service.list_public(tenant_slug, category=category)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.get("", response_model=ProductListDTO)
def list_products(
    principal: RequireTenant,
    include_inactive: bool = Query(default=False),
    category: str | None = Query(default=None),
    service: CatalogProductService = Depends(get_catalog_product_service),
) -> ProductListDTO:
    try:
        return service.list_for_tenant(
            principal.tenant_id,
            include_inactive=include_inactive,
            category=category,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.post("", response_model=ProductDTO, status_code=status.HTTP_201_CREATED)
def create_product(
    body: CreateProductRequest,
    principal: RequireServiceManager,
    service: CatalogProductService = Depends(get_catalog_product_service),
) -> ProductDTO:
    try:
        return service.create(
            principal.tenant_id,
            name=body.name,
            description=body.description,
            category=body.category,
            image_url=body.image_url,
            image_alt=body.image_alt,
            price_cents=body.price_cents,
            slug=body.slug,
            sort_order=body.sort_order,
            is_active=body.is_active,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.patch("/{product_id}", response_model=ProductDTO)
def update_product(
    product_id: str,
    body: UpdateProductRequest,
    principal: RequireServiceManager,
    service: CatalogProductService = Depends(get_catalog_product_service),
) -> ProductDTO:
    try:
        return service.update(
            principal.tenant_id,
            product_id,
            name=body.name,
            description=body.description,
            category=body.category,
            image_url=body.image_url,
            image_alt=body.image_alt,
            price_cents=body.price_cents,
            slug=body.slug,
            sort_order=body.sort_order,
            is_active=body.is_active,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    principal: RequireServiceManager,
    service: CatalogProductService = Depends(get_catalog_product_service),
) -> None:
    try:
        service.delete(principal.tenant_id, product_id)
    except DomainError as exc:
        raise _http_error(exc) from exc
