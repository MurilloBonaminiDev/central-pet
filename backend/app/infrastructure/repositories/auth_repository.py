from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.infrastructure.database.models import (
    MembershipModel,
    PasswordResetTokenModel,
    RefreshTokenModel,
    TenantModel,
    UserModel,
)


class AuthRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_user_by_email(self, email: str) -> UserModel | None:
        stmt = select(UserModel).where(UserModel.email == email.lower().strip())
        return self._db.scalar(stmt)

    def get_user_by_id(self, user_id: uuid.UUID) -> UserModel | None:
        return self._db.get(UserModel, user_id)

    def list_active_memberships(self, user_id: uuid.UUID) -> list[MembershipModel]:
        stmt = (
            select(MembershipModel)
            .options(joinedload(MembershipModel.tenant))
            .where(
                MembershipModel.user_id == user_id,
                MembershipModel.is_active.is_(True),
            )
        )
        return list(self._db.scalars(stmt).unique().all())

    def get_membership(self, user_id: uuid.UUID, tenant_id: uuid.UUID) -> MembershipModel | None:
        stmt = (
            select(MembershipModel)
            .options(joinedload(MembershipModel.tenant))
            .where(
                MembershipModel.user_id == user_id,
                MembershipModel.tenant_id == tenant_id,
                MembershipModel.is_active.is_(True),
            )
        )
        return self._db.scalar(stmt)

    def get_tenant(self, tenant_id: uuid.UUID) -> TenantModel | None:
        return self._db.get(TenantModel, tenant_id)

    def save_refresh_token(self, token: RefreshTokenModel) -> RefreshTokenModel:
        self._db.add(token)
        self._db.commit()
        self._db.refresh(token)
        return token

    def get_refresh_by_jti(self, jti: str) -> RefreshTokenModel | None:
        stmt = select(RefreshTokenModel).where(RefreshTokenModel.jti == jti)
        return self._db.scalar(stmt)

    def revoke_refresh_token(self, token: RefreshTokenModel) -> None:
        token.revoked_at = datetime.now(UTC)
        self._db.add(token)
        self._db.commit()

    def revoke_all_user_refresh_tokens(self, user_id: uuid.UUID, tenant_id: uuid.UUID | None = None) -> None:
        stmt = select(RefreshTokenModel).where(
            RefreshTokenModel.user_id == user_id,
            RefreshTokenModel.revoked_at.is_(None),
        )
        if tenant_id is not None:
            stmt = stmt.where(RefreshTokenModel.tenant_id == tenant_id)
        tokens = list(self._db.scalars(stmt).all())
        now = datetime.now(UTC)
        for token in tokens:
            token.revoked_at = now
            self._db.add(token)
        self._db.commit()

    def create_password_reset(self, reset: PasswordResetTokenModel) -> PasswordResetTokenModel:
        self._db.add(reset)
        self._db.commit()
        self._db.refresh(reset)
        return reset

    def get_password_reset_by_hash(self, token_hash: str) -> PasswordResetTokenModel | None:
        stmt = select(PasswordResetTokenModel).where(PasswordResetTokenModel.token_hash == token_hash)
        return self._db.scalar(stmt)

    def mark_password_reset_used(self, reset: PasswordResetTokenModel) -> None:
        reset.used_at = datetime.now(UTC)
        self._db.add(reset)
        self._db.commit()

    def update_user_password(self, user: UserModel, password_hash: str) -> None:
        user.password_hash = password_hash
        self._db.add(user)
        self._db.commit()
