from __future__ import annotations

import uuid

from app.application.dto.products import ProductDTO, ProductListDTO
from app.domain.exceptions import ConflictError, NotFoundError, ValidationError
from app.infrastructure.database.models import ProductModel
from app.infrastructure.repositories.product_repository import (
    PRODUCT_CATEGORIES,
    ProductRepository,
    slugify,
)


class CatalogProductService:
    def __init__(self, repository: ProductRepository) -> None:
        self._repo = repository

    @staticmethod
    def _to_dto(product: ProductModel) -> ProductDTO:
        return ProductDTO(
            id=str(product.id),
            slug=product.slug,
            name=product.name,
            description=product.description,
            category=product.category,
            image_url=product.image_url,
            image_alt=product.image_alt,
            price_cents=product.price_cents,
            sort_order=product.sort_order,
            is_active=product.is_active,
        )

    def list_public(self, tenant_slug: str, *, category: str | None = None) -> ProductListDTO:
        tenant = self._repo.get_tenant_by_slug(tenant_slug.strip())
        if tenant is None:
            raise NotFoundError("Clínica não encontrada")
        if category and category not in PRODUCT_CATEGORIES:
            raise ValidationError("Categoria inválida")
        products = self._repo.list_public_by_tenant_id(tenant.id, category=category)
        return ProductListDTO(
            items=[self._to_dto(item) for item in products],
            categories=list(PRODUCT_CATEGORIES),
        )

    def list_for_tenant(
        self,
        tenant_id: str,
        *,
        include_inactive: bool = False,
        category: str | None = None,
    ) -> ProductListDTO:
        if category and category not in PRODUCT_CATEGORIES:
            raise ValidationError("Categoria inválida")
        products = self._repo.list_by_tenant(
            uuid.UUID(tenant_id),
            include_inactive=include_inactive,
            category=category,
        )
        return ProductListDTO(
            items=[self._to_dto(item) for item in products],
            categories=list(PRODUCT_CATEGORIES),
        )

    def create(
        self,
        tenant_id: str,
        *,
        name: str,
        description: str,
        category: str,
        image_url: str,
        image_alt: str,
        price_cents: int,
        slug: str | None = None,
        sort_order: int = 0,
        is_active: bool = True,
    ) -> ProductDTO:
        self._validate_input(name, description, category, image_url, image_alt, price_cents)
        tenant_uuid = uuid.UUID(tenant_id)
        resolved_slug = slugify(slug or name)
        if not resolved_slug:
            raise ValidationError("Slug inválido")
        if self._repo.get_by_slug(tenant_uuid, resolved_slug):
            raise ConflictError("Já existe um produto com este identificador")

        product = self._repo.create(
            tenant_id=tenant_uuid,
            slug=resolved_slug,
            name=name.strip(),
            description=description.strip(),
            category=category,
            image_url=image_url.strip(),
            image_alt=image_alt.strip(),
            price_cents=price_cents,
            sort_order=sort_order,
            is_active=is_active,
        )
        return self._to_dto(product)

    def update(
        self,
        tenant_id: str,
        product_id: str,
        *,
        name: str | None = None,
        description: str | None = None,
        category: str | None = None,
        image_url: str | None = None,
        image_alt: str | None = None,
        price_cents: int | None = None,
        slug: str | None = None,
        sort_order: int | None = None,
        is_active: bool | None = None,
    ) -> ProductDTO:
        product = self._get_or_raise(tenant_id, product_id)
        tenant_uuid = uuid.UUID(tenant_id)

        if slug is not None:
            resolved_slug = slugify(slug)
            if not resolved_slug:
                raise ValidationError("Slug inválido")
            existing = self._repo.get_by_slug(tenant_uuid, resolved_slug)
            if existing and existing.id != product.id:
                raise ConflictError("Já existe um produto com este identificador")
            product.slug = resolved_slug

        if name is not None:
            if not name.strip():
                raise ValidationError("Nome é obrigatório")
            product.name = name.strip()

        if description is not None:
            if not description.strip():
                raise ValidationError("Descrição é obrigatória")
            product.description = description.strip()

        if category is not None:
            if category not in PRODUCT_CATEGORIES:
                raise ValidationError("Categoria inválida")
            product.category = category

        if image_url is not None:
            if not image_url.strip():
                raise ValidationError("URL da imagem é obrigatória")
            product.image_url = image_url.strip()

        if image_alt is not None:
            if not image_alt.strip():
                raise ValidationError("Texto alternativo da imagem é obrigatório")
            product.image_alt = image_alt.strip()

        if price_cents is not None:
            if price_cents < 0:
                raise ValidationError("Valor não pode ser negativo")
            product.price_cents = price_cents

        if sort_order is not None:
            product.sort_order = sort_order

        if is_active is not None:
            product.is_active = is_active

        self._repo.save(product)
        return self._to_dto(product)

    def delete(self, tenant_id: str, product_id: str) -> None:
        product = self._get_or_raise(tenant_id, product_id)
        self._repo.soft_delete(product)

    def _get_or_raise(self, tenant_id: str, product_id: str) -> ProductModel:
        product = self._repo.get_by_id(uuid.UUID(tenant_id), uuid.UUID(product_id))
        if product is None:
            raise NotFoundError("Produto não encontrado")
        return product

    @staticmethod
    def _validate_input(
        name: str,
        description: str,
        category: str,
        image_url: str,
        image_alt: str,
        price_cents: int,
    ) -> None:
        if not name.strip():
            raise ValidationError("Nome é obrigatório")
        if not description.strip():
            raise ValidationError("Descrição é obrigatória")
        if category not in PRODUCT_CATEGORIES:
            raise ValidationError("Categoria inválida")
        if not image_url.strip():
            raise ValidationError("URL da imagem é obrigatória")
        if not image_alt.strip():
            raise ValidationError("Texto alternativo da imagem é obrigatório")
        if price_cents < 0:
            raise ValidationError("Valor não pode ser negativo")
