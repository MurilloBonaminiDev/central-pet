from __future__ import annotations

from fastapi import Depends

from app.application.use_cases.appointment_service import AppointmentService
from app.api.deps.appointments import get_appointment_service
from app.core.config import settings
from app.infrastructure.messaging.whatsapp_adapter import WhatsAppInboundAdapter


def get_whatsapp_adapter() -> WhatsAppInboundAdapter:
    return WhatsAppInboundAdapter(
        app_secret=settings.WHATSAPP_APP_SECRET,
        verify_token=settings.WHATSAPP_VERIFY_TOKEN,
        enabled=settings.WHATSAPP_WEBHOOKS_ENABLED,
    )


def get_webhook_appointment_service(
    service: AppointmentService = Depends(get_appointment_service),
) -> AppointmentService:
    """Same appointment use case used by public booking and admin."""
    return service
