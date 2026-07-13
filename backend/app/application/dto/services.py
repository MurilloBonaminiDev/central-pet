from __future__ import annotations

from pydantic import BaseModel, Field


class ServiceDTO(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    image_url: str
    image_alt: str
    price_cents: int | None
    duration_minutes: int
    sort_order: int
    is_active: bool


class ServiceListDTO(BaseModel):
    items: list[ServiceDTO] = Field(default_factory=list)
