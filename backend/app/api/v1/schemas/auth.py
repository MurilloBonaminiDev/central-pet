from __future__ import annotations

from typing import Annotated

from pydantic import AfterValidator, BaseModel, Field


def _auth_email(value: str) -> str:
    """Accept practical emails including local-dev domains like *.local."""
    normalized = value.strip().lower()
    if "@" not in normalized:
        raise ValueError("e-mail inválido")
    local, _, domain = normalized.partition("@")
    if not local or not domain or "." not in domain:
        raise ValueError("e-mail inválido")
    return normalized


AuthEmail = Annotated[str, AfterValidator(_auth_email)]


class LoginRequest(BaseModel):
    email: AuthEmail
    password: str = Field(min_length=1)
    tenant_id: str | None = None


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str | None = None


class ForgotPasswordRequest(BaseModel):
    email: AuthEmail


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)
