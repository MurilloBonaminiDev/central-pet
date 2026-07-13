"""Authentication and authorization dependencies (middleware-style guards)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Annotated, Callable

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.application.use_cases.auth_service import AuthService
from app.core.config import settings
from app.domain.value_objects.roles import TenantRole
from app.infrastructure.database.session import get_db
from app.infrastructure.repositories.auth_repository import AuthRepository
from app.infrastructure.security.jwt import TokenValidationError, decode_token

bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class AuthenticatedPrincipal:
    user_id: str
    email: str | None
    tenant_id: str
    role: str
    token_payload: dict


def get_auth_service(db: Annotated[Session, Depends(get_db)]) -> AuthService:
    return AuthService(AuthRepository(db))


def get_current_principal(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> AuthenticatedPrincipal:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autenticação necessária",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = decode_token(credentials.credentials)
    except TokenValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Access token inválido")

    user_id = payload.get("sub")
    tenant_id = payload.get("tenant_id")
    role = payload.get("role")
    if not user_id or not tenant_id or not role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token incompleto")

    return AuthenticatedPrincipal(
        user_id=user_id,
        email=payload.get("email"),
        tenant_id=tenant_id,
        role=role,
        token_payload=payload,
    )


def require_tenant_header(
    principal: Annotated[AuthenticatedPrincipal, Depends(get_current_principal)],
    x_tenant_id: Annotated[str | None, Header(alias=settings.TENANT_HEADER)] = None,
) -> AuthenticatedPrincipal:
    """Ensures the request tenant header matches the JWT tenant claim."""
    if x_tenant_id and x_tenant_id != principal.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cabeçalho de empresa não corresponde à sessão",
        )
    return principal


def require_roles(*roles: TenantRole | str) -> Callable:
    allowed = {role.value if isinstance(role, TenantRole) else role for role in roles}

    def dependency(
        principal: Annotated[AuthenticatedPrincipal, Depends(require_tenant_header)],
    ) -> AuthenticatedPrincipal:
        if principal.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Perfil sem permissão para este recurso",
            )
        return principal

    return dependency


RequireAuth = Annotated[AuthenticatedPrincipal, Depends(get_current_principal)]
RequireTenant = Annotated[AuthenticatedPrincipal, Depends(require_tenant_header)]
RequireAdministrator = Annotated[
    AuthenticatedPrincipal, Depends(require_roles(TenantRole.ADMINISTRATOR))
]
RequireVeterinarian = Annotated[
    AuthenticatedPrincipal, Depends(require_roles(TenantRole.VETERINARIAN, TenantRole.ADMINISTRATOR))
]
RequireReception = Annotated[
    AuthenticatedPrincipal,
    Depends(require_roles(TenantRole.RECEPTION, TenantRole.ADMINISTRATOR)),
]
RequireFinancial = Annotated[
    AuthenticatedPrincipal,
    Depends(require_roles(TenantRole.FINANCIAL, TenantRole.ADMINISTRATOR)),
]
RequireFinanceStaff = Annotated[
    AuthenticatedPrincipal,
    Depends(
        require_roles(
            TenantRole.FINANCIAL,
            TenantRole.RECEPTION,
            TenantRole.ADMINISTRATOR,
        )
    ),
]
RequireGrooming = Annotated[
    AuthenticatedPrincipal,
    Depends(require_roles(TenantRole.GROOMING, TenantRole.ADMINISTRATOR)),
]
RequireServiceManager = Annotated[
    AuthenticatedPrincipal,
    Depends(require_roles(TenantRole.RECEPTION, TenantRole.ADMINISTRATOR)),
]
