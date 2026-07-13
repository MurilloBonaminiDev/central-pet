from __future__ import annotations

import re
import unicodedata
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy.exc import IntegrityError

from app.application.dto.auth import (
    ForgotPasswordResultDTO,
    LoginResultDTO,
    SessionUserDTO,
    TenantOptionDTO,
    TokenPairDTO,
)
from app.core.config import settings
from app.domain.exceptions import (
    AuthenticationError,
    AuthorizationError,
    ConflictError,
    PasswordResetError,
    TenantAccessError,
    TokenError,
    ValidationError,
)
from app.domain.value_objects.roles import TenantRole
from app.infrastructure.database.models import PasswordResetTokenModel, RefreshTokenModel
from app.infrastructure.repositories.auth_repository import AuthRepository
from app.infrastructure.security.jwt import (
    TokenValidationError,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.infrastructure.security.password import hash_password, verify_password
from app.infrastructure.security.tokens import generate_url_safe_token, hash_token


def _slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")
    return (slug[:80] or "clinica").rstrip("-")


class AuthService:
    def __init__(self, repo: AuthRepository) -> None:
        self._repo = repo

    def register(
        self,
        *,
        clinic_name: str,
        full_name: str,
        email: str,
        password: str,
    ) -> LoginResultDTO:
        clinic = clinic_name.strip()
        name = full_name.strip()
        if len(clinic) < 2:
            raise ValidationError("Informe o nome da clínica")
        if len(name) < 2:
            raise ValidationError("Informe o nome completo")
        if len(password) < 8:
            raise ValidationError("A senha deve ter pelo menos 8 caracteres")

        if self._repo.get_user_by_email(email) is not None:
            raise ConflictError("Já existe uma conta com este e-mail")

        base_slug = _slugify(clinic)
        slug = base_slug
        suffix = 2
        while self._repo.get_tenant_by_slug(slug) is not None:
            candidate = f"{base_slug[:76]}-{suffix}"
            slug = candidate[:80]
            suffix += 1
            if suffix > 100:
                raise ConflictError("Não foi possível gerar um identificador único para a clínica")

        try:
            tenant, user, membership = self._repo.create_tenant_with_admin(
                tenant_name=clinic,
                tenant_slug=slug,
                email=email,
                full_name=name,
                password_hash=hash_password(password),
                role=TenantRole.ADMINISTRATOR.value,
            )
        except IntegrityError as exc:
            raise ConflictError("E-mail ou clínica já cadastrados") from exc

        tokens, session = self._issue_session(
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            tenant_id=tenant.id,
            tenant_name=tenant.name,
            role=membership.role,
        )
        return LoginResultDTO(tokens=tokens, session=session)

    def login(self, email: str, password: str, tenant_id: str | None = None) -> LoginResultDTO:
        user = self._repo.get_user_by_email(email)
        if user is None or not user.is_active:
            raise AuthenticationError()
        if not verify_password(password, user.password_hash):
            raise AuthenticationError()

        memberships = [
            m
            for m in self._repo.list_active_memberships(user.id)
            if m.tenant is not None and m.tenant.is_active
        ]
        if not memberships:
            raise TenantAccessError("Usuário sem empresa ativa vinculada")

        if tenant_id is None:
            if len(memberships) > 1:
                return LoginResultDTO(
                    requires_tenant_selection=True,
                    tenants=[
                        TenantOptionDTO(
                            id=str(m.tenant_id),
                            name=m.tenant.name,
                            slug=m.tenant.slug,
                            role=m.role,
                        )
                        for m in memberships
                    ],
                )
            membership = memberships[0]
        else:
            try:
                tenant_uuid = uuid.UUID(tenant_id)
            except ValueError as exc:
                raise TenantAccessError("Identificador de empresa inválido") from exc
            membership = self._repo.get_membership(user.id, tenant_uuid)
            if membership is None or membership.tenant is None or not membership.tenant.is_active:
                raise TenantAccessError()

        self._assert_valid_role(membership.role)
        tokens, session = self._issue_session(
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            tenant_id=membership.tenant_id,
            tenant_name=membership.tenant.name,
            role=membership.role,
        )
        return LoginResultDTO(tokens=tokens, session=session)

    def refresh(self, refresh_token: str) -> TokenPairDTO:
        try:
            payload = decode_token(refresh_token)
        except TokenValidationError as exc:
            raise TokenError(str(exc)) from exc

        if payload.get("type") != "refresh":
            raise TokenError("Refresh token inválido")

        jti = payload.get("jti")
        sub = payload.get("sub")
        tenant_id = payload.get("tenant_id")
        role = payload.get("role")
        if not jti or not sub or not tenant_id or not role:
            raise TokenError("Refresh token incompleto")

        stored = self._repo.get_refresh_by_jti(jti)
        if stored is None or stored.revoked_at is not None:
            raise TokenError("Refresh token revogado ou inexistente")
        if stored.token_hash != hash_token(refresh_token):
            raise TokenError("Refresh token inválido")
        if stored.expires_at.astimezone(UTC) < datetime.now(UTC):
            raise TokenError("Refresh token expirado")

        user = self._repo.get_user_by_id(uuid.UUID(sub))
        if user is None or not user.is_active:
            raise AuthenticationError("Usuário inativo")

        membership = self._repo.get_membership(user.id, uuid.UUID(tenant_id))
        if membership is None or membership.tenant is None or not membership.tenant.is_active:
            raise TenantAccessError()

        self._repo.revoke_refresh_token(stored)
        tokens, _ = self._issue_session(
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            tenant_id=membership.tenant_id,
            tenant_name=membership.tenant.name,
            role=membership.role,
        )
        return tokens

    def logout(self, refresh_token: str | None = None, access_payload: dict | None = None) -> None:
        if refresh_token:
            try:
                payload = decode_token(refresh_token)
                jti = payload.get("jti")
                if jti:
                    stored = self._repo.get_refresh_by_jti(jti)
                    if stored and stored.revoked_at is None:
                        self._repo.revoke_refresh_token(stored)
                        return
            except TokenValidationError:
                pass

        if access_payload and access_payload.get("sub") and access_payload.get("tenant_id"):
            self._repo.revoke_all_user_refresh_tokens(
                user_id=uuid.UUID(access_payload["sub"]),
                tenant_id=uuid.UUID(access_payload["tenant_id"]),
            )

    def forgot_password(self, email: str) -> ForgotPasswordResultDTO:
        """Always returns a generic message to avoid user enumeration."""
        generic = ForgotPasswordResultDTO(
            message="Se o e-mail existir, enviaremos instruções para redefinir a senha."
        )
        user = self._repo.get_user_by_email(email)
        if user is None or not user.is_active:
            return generic

        raw_token = generate_url_safe_token()
        reset = PasswordResetTokenModel(
            user_id=user.id,
            token_hash=hash_token(raw_token),
            expires_at=datetime.now(UTC) + timedelta(hours=1),
        )
        self._repo.create_password_reset(reset)

        if settings.APP_ENV == "development" or settings.APP_DEBUG:
            return ForgotPasswordResultDTO(message=generic.message, reset_token=raw_token)
        return generic

    def reset_password(self, token: str, new_password: str) -> None:
        if len(new_password) < 8:
            raise PasswordResetError("A senha deve ter pelo menos 8 caracteres")

        reset = self._repo.get_password_reset_by_hash(hash_token(token))
        if reset is None or reset.used_at is not None:
            raise PasswordResetError()
        if reset.expires_at.astimezone(UTC) < datetime.now(UTC):
            raise PasswordResetError("Token de redefinição expirado")

        user = self._repo.get_user_by_id(reset.user_id)
        if user is None or not user.is_active:
            raise PasswordResetError()

        self._repo.update_user_password(user, hash_password(new_password))
        self._repo.mark_password_reset_used(reset)
        self._repo.revoke_all_user_refresh_tokens(user.id)

    def get_session(self, user_id: str, tenant_id: str, role: str) -> SessionUserDTO:
        user = self._repo.get_user_by_id(uuid.UUID(user_id))
        if user is None or not user.is_active:
            raise AuthenticationError("Sessão inválida")

        membership = self._repo.get_membership(user.id, uuid.UUID(tenant_id))
        if membership is None or membership.tenant is None or not membership.tenant.is_active:
            raise TenantAccessError()
        if membership.role != role:
            raise TenantAccessError("Papel da sessão não corresponde à empresa")

        return SessionUserDTO(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            tenant_id=str(membership.tenant_id),
            tenant_name=membership.tenant.name,
            role=membership.role,
        )

    def _issue_session(
        self,
        *,
        user_id: uuid.UUID,
        email: str,
        full_name: str,
        tenant_id: uuid.UUID,
        tenant_name: str,
        role: str,
    ) -> tuple[TokenPairDTO, SessionUserDTO]:
        access = create_access_token(
            subject=str(user_id),
            tenant_id=str(tenant_id),
            role=role,
            extra_claims={"email": email},
        )
        refresh, jti, expires_at = create_refresh_token(
            subject=str(user_id),
            tenant_id=str(tenant_id),
            role=role,
        )
        self._repo.save_refresh_token(
            RefreshTokenModel(
                user_id=user_id,
                tenant_id=tenant_id,
                jti=jti,
                token_hash=hash_token(refresh),
                expires_at=expires_at,
            )
        )
        tokens = TokenPairDTO(
            access_token=access,
            refresh_token=refresh,
            expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
        session = SessionUserDTO(
            id=str(user_id),
            email=email,
            full_name=full_name,
            tenant_id=str(tenant_id),
            tenant_name=tenant_name,
            role=role,
        )
        return tokens, session

    @staticmethod
    def _assert_valid_role(role: str) -> None:
        try:
            TenantRole(role)
        except ValueError as exc:
            raise AuthorizationError("Papel de acesso inválido") from exc
