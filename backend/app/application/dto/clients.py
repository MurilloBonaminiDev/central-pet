from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field


class PetDTO(BaseModel):
    id: str
    name: str
    species: str
    breed: str
    age_years: int | None
    created_at: str


class ClientHistoryDTO(BaseModel):
    id: str
    entry_type: str
    entry_type_label: str
    title: str
    description: str | None
    occurred_on: date
    pet_id: str | None
    pet_name: str | None
    appointment_id: str | None
    created_at: str


class ClientListItemDTO(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    pets_count: int
    created_at: str


class ClientListDTO(BaseModel):
    items: list[ClientListItemDTO] = Field(default_factory=list)


class ClientDetailDTO(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    notes: str | None
    pets: list[PetDTO] = Field(default_factory=list)
    history: list[ClientHistoryDTO] = Field(default_factory=list)
    created_at: str


class ImportClientsResultDTO(BaseModel):
    clients_created: int
    pets_created: int
    history_created: int
