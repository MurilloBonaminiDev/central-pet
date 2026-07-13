from __future__ import annotations

from pydantic import BaseModel, Field


class ProductDTO(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    category: str
    image_url: str
    image_alt: str
    price_cents: int
    sort_order: int
    is_active: bool


class ProductListDTO(BaseModel):
    items: list[ProductDTO] = Field(default_factory=list)
    categories: list[str] = Field(default_factory=list)
