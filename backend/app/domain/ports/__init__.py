"""Domain ports — stable contracts for external integrations."""

from app.domain.ports.inbound_messaging import ChannelBookingIntent, InboundMessagingPort

__all__ = ["ChannelBookingIntent", "InboundMessagingPort"]
