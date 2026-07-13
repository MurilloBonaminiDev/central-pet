# WhatsApp inbound booking — architecture prep

## Goal

When a client requests a booking over WhatsApp, create the same `PENDENTE`
appointment record used by the public site form so it appears on:

- Admin **Agendamentos**
- Dashboard KPIs (pending / today / charts after completion)

## Flow (when enabled later)

```
WhatsApp / BSP
    → POST /api/v1/webhooks/whatsapp
    → WhatsAppInboundAdapter (verify + parse)
    → ChannelBookingIntent (domain port DTO)
    → AppointmentService.create_from_channel
    → appointments table (source=WHATSAPP, status=PENDENTE)
    → Admin dashboard / list (no special filter required)
```

## What is already in place

| Piece | Location |
|-------|----------|
| Port | `backend/app/domain/ports/inbound_messaging.py` |
| Source VO | `backend/app/domain/value_objects/appointment_source.py` |
| Adapter stub | `backend/app/infrastructure/messaging/whatsapp_adapter.py` |
| Use case | `AppointmentService.create_from_channel` |
| Columns | `appointments.source`, `appointments.external_message_id` |
| Webhook routes | `GET/POST /api/v1/webhooks/whatsapp` → **501** while disabled |
| Config | `WHATSAPP_WEBHOOKS_ENABLED`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET` |

## What is NOT implemented yet

- Meta / BSP API credentials and HTTP calls
- Signature verification (`X-Hub-Signature-256`)
- NLU / interactive forms to extract date, service, pet from chat
- Outbound WhatsApp notifications (confirmations)

## Enabling later (checklist)

1. Implement `WhatsAppInboundAdapter.verify_webhook` and `parse_booking_intent`
2. Set env secrets and `WHATSAPP_WEBHOOKS_ENABLED=true`
3. Point Meta webhook URL to `/api/v1/webhooks/whatsapp`
4. Map phone → `tenant_slug` (or dedicated WhatsApp Business number per clinic)
5. Keep using `external_message_id` for idempotency
