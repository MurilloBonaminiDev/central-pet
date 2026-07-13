from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field


class CreateClientRequest(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    phone: str = Field(min_length=1, max_length=40)
    email: str = Field(min_length=3, max_length=255)
    notes: str | None = Field(default=None, max_length=2000)


class UpdateClientRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    phone: str | None = Field(default=None, min_length=1, max_length=40)
    email: str | None = Field(default=None, min_length=3, max_length=255)
    notes: str | None = Field(default=None, max_length=2000)


class CreatePetRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    species: str = Field(min_length=1, max_length=60)
    breed: str = Field(default="", max_length=120)
    age_years: int | None = Field(default=None, ge=0, le=40)


class UpdatePetRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    species: str | None = Field(default=None, min_length=1, max_length=60)
    breed: str | None = Field(default=None, max_length=120)
    age_years: int | None = Field(default=None, ge=0, le=40)
    clear_age: bool = False


class CreateHistoryRequest(BaseModel):
    entry_type: str = Field(min_length=1, max_length=40)
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=4000)
    occurred_on: date
    pet_id: str | None = None
