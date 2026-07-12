"""Seed auth demo data for local development (not product cadastro)."""

from __future__ import annotations

import uuid

from sqlalchemy import select

from app.domain.value_objects.roles import TenantRole
from app.infrastructure.database.models import MembershipModel, TenantModel, UserModel
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.security.password import hash_password

DEMO_PASSWORD = "Senha@123"


def seed() -> None:
    db = SessionLocal()
    try:
        tenant = db.scalar(select(TenantModel).where(TenantModel.slug == "clinica-demo"))
        if tenant is None:
            tenant = TenantModel(
                id=uuid.uuid4(),
                name="Clínica Demo Central Pet",
                slug="clinica-demo",
                is_active=True,
            )
            db.add(tenant)
            db.flush()

        demo_users = [
            ("admin@centralpet.local", "Admin Demo", TenantRole.ADMINISTRATOR),
            ("vet@centralpet.local", "Veterinário Demo", TenantRole.VETERINARIAN),
            ("recepcao@centralpet.local", "Recepção Demo", TenantRole.RECEPTION),
            ("financeiro@centralpet.local", "Financeiro Demo", TenantRole.FINANCIAL),
            ("tosa@centralpet.local", "Banho e Tosa Demo", TenantRole.GROOMING),
        ]

        for email, full_name, role in demo_users:
            user = db.scalar(select(UserModel).where(UserModel.email == email))
            if user is None:
                user = UserModel(
                    id=uuid.uuid4(),
                    email=email,
                    full_name=full_name,
                    password_hash=hash_password(DEMO_PASSWORD),
                    is_active=True,
                )
                db.add(user)
                db.flush()

            membership = db.scalar(
                select(MembershipModel).where(
                    MembershipModel.user_id == user.id,
                    MembershipModel.tenant_id == tenant.id,
                )
            )
            if membership is None:
                db.add(
                    MembershipModel(
                        id=uuid.uuid4(),
                        user_id=user.id,
                        tenant_id=tenant.id,
                        role=role.value,
                        is_active=True,
                    )
                )

        db.commit()
        print("Auth seed OK")
        print(f"Tenant: {tenant.slug} ({tenant.id})")
        print(f"Password for all demo users: {DEMO_PASSWORD}")
        for email, _, role in demo_users:
            print(f"  - {email} [{role.value}]")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
