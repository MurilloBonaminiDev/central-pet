from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps.auth import RequireTenant
from app.api.deps.dashboard import get_dashboard_service
from app.application.dto.dashboard import DashboardStatsDTO
from app.application.use_cases.dashboard_service import DashboardService
from app.domain.exceptions import DomainError, NotFoundError, ValidationError

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _http_error(exc: DomainError) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)


@router.get("/stats", response_model=DashboardStatsDTO)
def get_dashboard_stats(
    principal: RequireTenant,
    service: DashboardService = Depends(get_dashboard_service),
) -> DashboardStatsDTO:
    """Métricas reais da clínica para a dashboard administrativa."""
    try:
        return service.get_stats(principal.tenant_id)
    except DomainError as exc:
        raise _http_error(exc) from exc
