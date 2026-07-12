from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class TenantOptionDTO(BaseModel):
    id: str
    name: str
    slug: str
    role: str


class TokenPairDTO(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class SessionUserDTO(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    tenant_id: str
    tenant_name: str
    role: str


class LoginResultDTO(BaseModel):
    requires_tenant_selection: bool = False
    tenants: list[TenantOptionDTO] = Field(default_factory=list)
    tokens: TokenPairDTO | None = None
    session: SessionUserDTO | None = None


class ForgotPasswordResultDTO(BaseModel):
    message: str
    reset_token: str | None = None  # only returned in development for local testing
