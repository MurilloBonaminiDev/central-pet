from __future__ import annotations

from pydantic import BaseModel, Field

from app.infrastructure.repositories.product_repository import PRODUCT_CATEGORIES


class CreateProductRequest(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    description: str = Field(min_length=1)
    category: str = Field(min_length=1, max_length=60)
    image_url: str = Field(min_length=1, max_length=512)
    image_alt: str = Field(min_length=1, max_length=200)
    price_cents: int = Field(ge=0)
    slug: str | None = Field(default=None, max_length=80)
    sort_order: int = Field(default=0, ge=0)
    is_active: bool = True


class UpdateProductRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    description: str | None = Field(default=None, min_length=1)
    category: str | None = Field(default=None, min_length=1, max_length=60)
    image_url: str | None = Field(default=None, min_length=1, max_length=512)
    image_alt: str | None = Field(default=None, min_length=1, max_length=200)
    price_cents: int | None = Field(default=None, ge=0)
    slug: str | None = Field(default=None, max_length=80)
    sort_order: int | None = Field(default=None, ge=0)
    is_active: bool | None = None


__all__ = ["CreateProductRequest", "UpdateProductRequest", "PRODUCT_CATEGORIES"]
