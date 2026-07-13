"""Messaging adapters (WhatsApp, future SMS/providers)."""

from app.infrastructure.messaging.whatsapp_adapter import WhatsAppInboundAdapter

__all__ = ["WhatsAppInboundAdapter"]
