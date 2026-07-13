from __future__ import annotations

import uuid

from app.application.dto.services import ServiceDTO, ServiceListDTO
from app.domain.exceptions import ConflictError, NotFoundError, ValidationError
from app.infrastructure.database.models import ServiceModel
from app.infrastructure.repositories.service_repository import ServiceRepository, slugify


class CatalogService:
    def __init__(self, repository: ServiceRepository) -> None:
        self._repo = repository

    @staticmethod
    def _to_dto(service: ServiceModel) -> ServiceDTO:
        return ServiceDTO(
            id=str(service.id),
            slug=service.slug,
            name=service.name,
            description=service.description,
            image_url=service.image_url,
            image_alt=service.image_alt,
            price_cents=service.price_cents,
            duration_minutes=service.duration_minutes,
            sort_order=service.sort_order,
            is_active=service.is_active,
        )

    def list_public(self, tenant_slug: str) -> ServiceListDTO:
        tenant = self._repo.get_tenant_by_slug(tenant_slug.strip())
        if tenant is None:
            raise NotFoundError("Clínica não encontrada")
        services = self._repo.list_public_by_tenant_id(tenant.id)
        return ServiceListDTO(items=[self._to_dto(item) for item in services])

    def list_for_tenant(self, tenant_id: str, *, include_inactive: bool = False) -> ServiceListDTO:
        services = self._repo.list_all_by_tenant(uuid.UUID(tenant_id)) if include_inactive else self._repo.list_by_tenant(uuid.UUID(tenant_id))
        return ServiceListDTO(items=[self._to_dto(item) for item in services])

    def create(
        self,
        tenant_id: str,
        *,
        name: str,
        description: str,
        image_url: str,
        image_alt: str,
        price_cents: int | None,
        duration_minutes: int,
        slug: str | None = None,
        sort_order: int = 0,
        is_active: bool = True,
    ) -> ServiceDTO:
        self._validate_service_input(name, description, image_url, image_alt, duration_minutes, price_cents)
        tenant_uuid = uuid.UUID(tenant_id)
        resolved_slug = slugify(slug or name)
        if not resolved_slug:
            raise ValidationError("Slug inválido")

        if self._repo.get_by_slug(tenant_uuid, resolved_slug):
            raise ConflictError("Já existe um serviço com este identificador")

        service = self._repo.create(
            tenant_id=tenant_uuid,
            slug=resolved_slug,
            name=name.strip(),
            description=description.strip(),
            image_url=image_url.strip(),
            image_alt=image_alt.strip(),
            price_cents=price_cents,
            duration_minutes=duration_minutes,
            sort_order=sort_order,
            is_active=is_active,
        )
        return self._to_dto(service)

    def update(
        self,
        tenant_id: str,
        service_id: str,
        *,
        name: str | None = None,
        description: str | None = None,
        image_url: str | None = None,
        image_alt: str | None = None,
        price_cents: int | None = None,
        duration_minutes: int | None = None,
        slug: str | None = None,
        sort_order: int | None = None,
        is_active: bool | None = None,
        clear_price: bool = False,
    ) -> ServiceDTO:
        service = self._get_service_or_raise(tenant_id, service_id)
        tenant_uuid = uuid.UUID(tenant_id)

        if slug is not None:
            resolved_slug = slugify(slug)
            if not resolved_slug:
                raise ValidationError("Slug inválido")
            existing = self._repo.get_by_slug(tenant_uuid, resolved_slug)
            if existing and existing.id != service.id:
                raise ConflictError("Já existe um serviço com este identificador")
            service.slug = resolved_slug

        if name is not None:
            if not name.strip():
                raise ValidationError("Nome é obrigatório")
            service.name = name.strip()

        if description is not None:
            if not description.strip():
                raise ValidationError("Descrição é obrigatória")
            service.description = description.strip()

        if image_url is not None:
            if not image_url.strip():
                raise ValidationError("URL da imagem é obrigatória")
            service.image_url = image_url.strip()

        if image_alt is not None:
            if not image_alt.strip():
                raise ValidationError("Texto alternativo da imagem é obrigatório")
            service.image_alt = image_alt.strip()

        if clear_price:
            service.price_cents = None
        elif price_cents is not None:
            if price_cents < 0:
                raise ValidationError("Valor não pode ser negativo")
            service.price_cents = price_cents

        if duration_minutes is not None:
            if duration_minutes <= 0:
                raise ValidationError("Duração deve ser maior que zero")
            service.duration_minutes = duration_minutes

        if sort_order is not None:
            service.sort_order = sort_order

        if is_active is not None:
            service.is_active = is_active

        self._repo.save(service)
        return self._to_dto(service)

    def delete(self, tenant_id: str, service_id: str) -> None:
        service = self._get_service_or_raise(tenant_id, service_id)
        self._repo.soft_delete(service)

    def _get_service_or_raise(self, tenant_id: str, service_id: str) -> ServiceModel:
        service = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(service_id))
        if service is None:
            raise NotFoundError("Serviço não encontrado")
        return service

    @staticmethod
    def _validate_service_input(
        name: str,
        description: str,
        image_url: str,
        image_alt: str,
        duration_minutes: int,
        price_cents: int | None,
    ) -> None:
        if not name.strip():
            raise ValidationError("Nome é obrigatório")
        if not description.strip():
            raise ValidationError("Descrição é obrigatória")
        if not image_url.strip():
            raise ValidationError("URL da imagem é obrigatória")
        if not image_alt.strip():
            raise ValidationError("Texto alternativo da imagem é obrigatório")
        if duration_minutes <= 0:
            raise ValidationError("Duração deve ser maior que zero")
        if price_cents is not None and price_cents < 0:
            raise ValidationError("Valor não pode ser negativo")
