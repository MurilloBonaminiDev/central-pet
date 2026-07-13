from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.api.deps.auth import RequireTenant
from app.api.deps.finance import get_finance_service
from app.api.v1.schemas.finance import (
    CreateFinanceTransactionRequest,
    UpdateFinanceTransactionRequest,
)
from app.application.dto.finance import (
    FinanceSummaryDTO,
    FinanceTransactionDTO,
    FinanceTransactionListDTO,
)
from app.application.use_cases.finance_service import FinanceService
from app.domain.exceptions import DomainError, NotFoundError, ValidationError

router = APIRouter(prefix="/finance", tags=["finance"])


def _http_error(exc: DomainError) -> HTTPException:
    if isinstance(exc, NotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=exc.message)
    if isinstance(exc, ValidationError):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)


@router.get("/summary", response_model=FinanceSummaryDTO)
def get_finance_summary(
    principal: RequireTenant,
    service: Annotated[FinanceService, Depends(get_finance_service)],
) -> FinanceSummaryDTO:
    assert principal.tenant_id is not None
    try:
        return service.get_summary(principal.tenant_id)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.get("/transactions", response_model=FinanceTransactionListDTO)
def list_finance_transactions(
    principal: RequireTenant,
    service: Annotated[FinanceService, Depends(get_finance_service)],
    type: Annotated[str | None, Query()] = None,
) -> FinanceTransactionListDTO:
    assert principal.tenant_id is not None
    try:
        return service.list_transactions(principal.tenant_id, type_filter=type)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.post(
    "/transactions",
    response_model=FinanceTransactionDTO,
    status_code=status.HTTP_201_CREATED,
)
def create_finance_transaction(
    body: CreateFinanceTransactionRequest,
    principal: RequireTenant,
    service: Annotated[FinanceService, Depends(get_finance_service)],
) -> FinanceTransactionDTO:
    assert principal.tenant_id is not None
    try:
        return service.create(
            principal.tenant_id,
            type=body.type,
            category=body.category,
            description=body.description,
            amount_cents=body.amount_cents,
            occurred_on=body.occurred_on,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.patch("/transactions/{transaction_id}", response_model=FinanceTransactionDTO)
def update_finance_transaction(
    transaction_id: str,
    body: UpdateFinanceTransactionRequest,
    principal: RequireTenant,
    service: Annotated[FinanceService, Depends(get_finance_service)],
) -> FinanceTransactionDTO:
    assert principal.tenant_id is not None
    try:
        return service.update(
            principal.tenant_id,
            transaction_id,
            type=body.type,
            category=body.category,
            description=body.description,
            amount_cents=body.amount_cents,
            occurred_on=body.occurred_on,
        )
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.delete("/transactions/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_finance_transaction(
    transaction_id: str,
    principal: RequireTenant,
    service: Annotated[FinanceService, Depends(get_finance_service)],
) -> Response:
    assert principal.tenant_id is not None
    try:
        service.delete(principal.tenant_id, transaction_id)
    except DomainError as exc:
        raise _http_error(exc) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)
