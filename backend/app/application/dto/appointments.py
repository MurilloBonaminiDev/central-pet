from __future__ import annotations

from datetime import date, time

from pydantic import BaseModel, Field


class AppointmentDTO(BaseModel):
    id: str
    client_name: str
    client_phone: str
    client_email: str
    pet_name: str
    pet_species: str
    service_id: str | None
    service_name: str
    desired_date: date
    desired_time: time
    notes: str | None
    status: str
    source: str
    external_message_id: str | None = None
    created_at: str


class AppointmentListDTO(BaseModel):
    items: list[AppointmentDTO] = Field(default_factory=list)


class AppointmentCreateResultDTO(BaseModel):
    appointment: AppointmentDTO
    message: str
