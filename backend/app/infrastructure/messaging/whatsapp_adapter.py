"""WhatsApp inbound adapter — structure only (integration not enabled).

When WHATSAPP_WEBHOOKS_ENABLED is true, replace the stub methods with:
- Meta Cloud API signature verification (X-Hub-Signature-256)
- Message / interactive reply parsing → ChannelBookingIntent
- Optional AI/NLU step to extract date, service, pet from free text
"""

from __future__ import annotations

from app.domain.ports.inbound_messaging import ChannelBookingIntent, InboundMessagingPort


class WhatsAppInboundAdapter(InboundMessagingPort):
    """Placeholder adapter. Does not call Meta / BSP APIs yet."""

    def __init__(
        self,
        *,
        app_secret: str = "",
        verify_token: str = "",
        enabled: bool = False,
    ) -> None:
        self._app_secret = app_secret
        self._verify_token = verify_token
        self._enabled = enabled

    @property
    def enabled(self) -> bool:
        return self._enabled

    def verify_webhook(self, *, headers: dict[str, str], body: bytes) -> bool:
        # TODO: validate X-Hub-Signature-256 with app_secret when enabled.
        _ = (headers, body, self._app_secret)
        return False

    def parse_booking_intent(self, *, body: bytes) -> ChannelBookingIntent | None:
        # TODO: map WhatsApp webhook JSON → ChannelBookingIntent.
        _ = body
        return None

    def handle_verification_challenge(
        self,
        *,
        hub_mode: str | None,
        hub_verify_token: str | None,
        hub_challenge: str | None,
    ) -> str | None:
        """Meta webhook subscription handshake (GET). Returns challenge or None."""
        if not self._enabled:
            return None
        if hub_mode == "subscribe" and hub_verify_token == self._verify_token:
            return hub_challenge
        return None
