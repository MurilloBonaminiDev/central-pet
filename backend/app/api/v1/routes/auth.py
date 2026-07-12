from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from app.api.deps.auth import RequireTenant, bearer_scheme, get_auth_service
from app.api.v1.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    ResetPasswordRequest,
)
from app.application.dto.auth import (
    ForgotPasswordResultDTO,
    LoginResultDTO,
    SessionUserDTO,
    TokenPairDTO,
)
from app.application.use_cases.auth_service import AuthService
from app.domain.exceptions import (
    AuthenticationError,
    AuthorizationError,
    DomainError,
    PasswordResetError,
    TenantAccessError,
    TokenError,
)
from app.domain.value_objects.roles import ROLE_LABELS_PT, TenantRole
from app.infrastructure.security.jwt import TokenValidationError, decode_token

router = APIRouter(prefix="/auth", tags=["auth"])


def _http_error(exc: DomainError) -> HTTPException:
    if isinstance(exc, (AuthenticationError, TokenError)):
        return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=exc.message)
    if isinstance(exc, (AuthorizationError, TenantAccessError)):
        return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=exc.message)
    if isinstance(exc, PasswordResetError):
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=exc.message)


@router.post("/login", response_model=LoginResultDTO)
def login(
    body: LoginRequest,
    service: AuthService = Depends(get_auth_service),
) -> LoginResultDTO:
    try:
        return service.login(email=body.email, password=body.password, tenant_id=body.tenant_id)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.post("/refresh", response_model=TokenPairDTO)
def refresh(
    body: RefreshRequest,
    service: AuthService = Depends(get_auth_service),
) -> TokenPairDTO:
    try:
        return service.refresh(body.refresh_token)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    body: LogoutRequest,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    service: AuthService = Depends(get_auth_service),
) -> None:
    access_payload = None
    if credentials and credentials.scheme.lower() == "bearer":
        try:
            access_payload = decode_token(credentials.credentials)
        except TokenValidationError:
            access_payload = None
    try:
        service.logout(refresh_token=body.refresh_token, access_payload=access_payload)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.post("/forgot-password", response_model=ForgotPasswordResultDTO)
def forgot_password(
    body: ForgotPasswordRequest,
    service: AuthService = Depends(get_auth_service),
) -> ForgotPasswordResultDTO:
    try:
        return service.forgot_password(body.email)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
def reset_password(
    body: ResetPasswordRequest,
    service: AuthService = Depends(get_auth_service),
) -> None:
    try:
        service.reset_password(token=body.token, new_password=body.new_password)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.get("/me", response_model=SessionUserDTO)
def me(
    principal: RequireTenant,
    service: AuthService = Depends(get_auth_service),
) -> SessionUserDTO:
    try:
        return service.get_session(principal.user_id, principal.tenant_id, principal.role)
    except DomainError as exc:
        raise _http_error(exc) from exc


@router.get("/roles")
def list_roles() -> dict[str, list[dict[str, str]]]:
    return {
        "roles": [{"id": role.value, "label": ROLE_LABELS_PT[role]} for role in TenantRole]
    }
