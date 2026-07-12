"""JWT helpers for access and refresh tokens."""

from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

from jose import JWTError, jwt

from app.core.config import settings


class TokenValidationError(Exception):
    """Raised when a JWT cannot be decoded or validated."""


def _encode(claims: dict[str, Any], expires_delta: timedelta) -> str:
    payload = claims.copy()
    payload["exp"] = datetime.now(UTC) + expires_delta
    payload["iat"] = datetime.now(UTC)
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(
    *,
    subject: str,
    tenant_id: str,
    role: str,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    claims: dict[str, Any] = {
        "sub": subject,
        "tenant_id": tenant_id,
        "role": role,
        "type": "access",
        "jti": str(uuid4()),
    }
    if extra_claims:
        claims.update(extra_claims)
    return _encode(claims, timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES))


def create_refresh_token(
    *,
    subject: str,
    tenant_id: str,
    role: str,
    jti: str | None = None,
    extra_claims: dict[str, Any] | None = None,
) -> tuple[str, str, datetime]:
    token_jti = jti or str(uuid4())
    expires_at = datetime.now(UTC) + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    claims: dict[str, Any] = {
        "sub": subject,
        "tenant_id": tenant_id,
        "role": role,
        "type": "refresh",
        "jti": token_jti,
    }
    if extra_claims:
        claims.update(extra_claims)
    token = _encode(claims, timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS))
    return token, token_jti, expires_at


def decode_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise TokenValidationError("Token inválido ou expirado") from exc
