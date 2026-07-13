"""Inbound webhooks for external channels (WhatsApp, etc.).

Integration is intentionally disabled until credentials and adapter parsing
are implemented. Enabling WHATSAPP_WEBHOOKS_ENABLED alone is not enough —
``WhatsAppInboundAdapter`` still returns stub responses.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status

from app.api.deps.webhooks import get_webhook_appointment_service, get_whatsapp_adapter
from app.application.use_cases.appointment_service import AppointmentService
from app.core.config import settings
from app.domain.exceptions import DomainError, NotFoundError, ValidationError
from app.infrastructure.messaging.whatsapp_adapter import WhatsAppInboundAdapter

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


def _http_error(exc: DomainError) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)


@router.get("/whatsapp")
def whatsapp_verify(
    adapter: Annotated[WhatsAppInboundAdapter, Depends(get_whatsapp_adapter)],
    hub_mode: Annotated[str | None, Query(alias="hub.mode")] = None,
    hub_verify_token: Annotated[str | None, Query(alias="hub.verify_token")] = None,
    hub_challenge: Annotated[str | None, Query(alias="hub.challenge")] = None,
) -> Response:
    """Meta webhook verification handshake (structure ready, inactive by default)."""
    if not settings.WHATSAPP_WEBHOOKS_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=(
                "Webhook WhatsApp ainda não habilitado. "
                "Defina WHATSAPP_WEBHOOKS_ENABLED=true e implemente o adapter."
            ),
        )
    challenge = adapter.handle_verification_challenge(
        hub_mode=hub_mode,
        hub_verify_token=hub_verify_token,
        hub_challenge=hub_challenge,
    )
    if challenge is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verificação inválida")
    return Response(content=challenge, media_type="text/plain")


@router.post("/whatsapp")
async def whatsapp_inbound(
    request: Request,
    adapter: Annotated[WhatsAppInboundAdapter, Depends(get_whatsapp_adapter)],
    appointments: Annotated[AppointmentService, Depends(get_webhook_appointment_service)],
) -> dict[str, str]:
    """Receive WhatsApp events and create PENDENTE appointments on the dashboard.

    Flow when enabled:
      1. Verify signature
      2. Parse ChannelBookingIntent via adapter
      3. AppointmentService.create_from_channel → same table as site bookings
    """
    if not settings.WHATSAPP_WEBHOOKS_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=(
                "Integração WhatsApp preparada, mas não ativa. "
                "Use AppointmentService.create_from_channel quando o adapter estiver pronto."
            ),
        )

    body = await request.body()
    headers = {k.lower(): v for k, v in request.headers.items()}

    if not adapter.verify_webhook(headers=headers, body=body):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Assinatura inválida")

    intent = adapter.parse_booking_intent(body=body)
    if intent is None:
        # Non-booking messages are acknowledged so the provider does not retry.
        return {"status": "ignored"}

    try:
        result = appointments.create_from_channel(intent)
    except DomainError as exc:
        raise _http_error(exc) from exc

    return {
        "status": "created",
        "appointment_id": result.appointment.id,
        "message": result.message,
    }
