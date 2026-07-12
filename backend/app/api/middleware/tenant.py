"""HTTP middleware for tenant context attachment."""

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.core.config import settings


class TenantContextMiddleware(BaseHTTPMiddleware):
    """Reads X-Tenant-Id and stores it on request.state for downstream handlers."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        tenant_id = request.headers.get(settings.TENANT_HEADER)
        request.state.tenant_id = tenant_id
        response = await call_next(request)
        if tenant_id:
            response.headers[settings.TENANT_HEADER] = tenant_id
        return response
