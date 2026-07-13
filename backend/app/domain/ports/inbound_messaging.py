"""Ports for inbound messaging integrations (WhatsApp, etc.).

Adapters live under ``app.infrastructure.messaging``. Use cases depend only on
these contracts — never on provider SDKs.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, time
from typing import Protocol


@dataclass(frozen=True, slots=True)
class ChannelBookingIntent:
    """Normalized booking request extracted from an external channel message."""

    tenant_slug: str
    client_name: str
    client_phone: str
    client_email: str | None
    pet_name: str
    pet_species: str
    service_name: str
    desired_date: date
    desired_time: time
    notes: str | None
    external_message_id: str
    source: str
    raw_provider: str = "unknown"


class InboundMessagingPort(Protocol):
    """Parse and verify inbound provider payloads into domain intents.

    Future WhatsApp Cloud API / BSP adapters implement this protocol.
    """

    def verify_webhook(self, *, headers: dict[str, str], body: bytes) -> bool:
        """Return True when the request signature / challenge is valid."""

    def parse_booking_intent(self, *, body: bytes) -> ChannelBookingIntent | None:
        """Extract a booking intent, or None when the message is not a booking."""
