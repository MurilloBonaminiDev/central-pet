from __future__ import annotations

from datetime import date, time

from pydantic import BaseModel, EmailStr, Field


class CreateAppointmentRequest(BaseModel):
    client_name: str = Field(min_length=1, max_length=160)
    client_phone: str = Field(min_length=8, max_length=40)
    client_email: EmailStr
    pet_name: str = Field(min_length=1, max_length=120)
    pet_species: str = Field(min_length=1, max_length=60)
    service_id: str | None = None
    service_name: str | None = Field(default=None, max_length=160)
    desired_date: date
    desired_time: time
    notes: str | None = Field(default=None, max_length=2000)


class UpdateAppointmentStatusRequest(BaseModel):
    status: str = Field(min_length=1, max_length=40)
