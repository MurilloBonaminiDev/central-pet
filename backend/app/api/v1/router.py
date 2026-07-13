from fastapi import APIRouter

from app.api.v1.routes import (
    appointments,
    auth,
    clients,
    dashboard,
    finance,
    health,
    products,
    services,
    webhooks,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router)
api_router.include_router(services.router)
api_router.include_router(products.router)
api_router.include_router(appointments.router)
api_router.include_router(dashboard.router)
api_router.include_router(finance.router)
api_router.include_router(clients.router)
api_router.include_router(webhooks.router)
