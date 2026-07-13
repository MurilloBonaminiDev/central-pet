"""Alembic migration — appointments / online booking requests."""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004_appointments"
down_revision: Union[str, None] = "0003_catalog_products"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _uuid() -> sa.Uuid:
    return sa.Uuid(as_uuid=True)


def _now_default() -> sa.TextClause:
    bind = op.get_bind()
    if bind.dialect.name == "sqlite":
        return sa.text("(CURRENT_TIMESTAMP)")
    return sa.text("now()")


def upgrade() -> None:
    uuid_type = _uuid()
    now = _now_default()

    op.create_table(
        "appointments",
        sa.Column("id", uuid_type, primary_key=True, nullable=False),
        sa.Column("tenant_id", uuid_type, sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("client_name", sa.String(length=160), nullable=False),
        sa.Column("client_phone", sa.String(length=40), nullable=False),
        sa.Column("client_email", sa.String(length=255), nullable=False),
        sa.Column("pet_name", sa.String(length=120), nullable=False),
        sa.Column("pet_species", sa.String(length=60), nullable=False),
        sa.Column("service_id", uuid_type, sa.ForeignKey("services.id", ondelete="SET NULL"), nullable=True),
        sa.Column("service_name", sa.String(length=160), nullable=False),
        sa.Column("desired_date", sa.Date(), nullable=False),
        sa.Column("desired_time", sa.Time(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=40), nullable=False, server_default="PENDENTE"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
    )
    op.create_index("ix_appointments_tenant_id", "appointments", ["tenant_id"])
    op.create_index("ix_appointments_status", "appointments", ["status"])
    op.create_index("ix_appointments_service_id", "appointments", ["service_id"])
    op.create_index(
        "ix_appointments_tenant_status_date",
        "appointments",
        ["tenant_id", "status", "desired_date"],
    )


def downgrade() -> None:
    op.drop_index("ix_appointments_tenant_status_date", table_name="appointments")
    op.drop_index("ix_appointments_service_id", table_name="appointments")
    op.drop_index("ix_appointments_status", table_name="appointments")
    op.drop_index("ix_appointments_tenant_id", table_name="appointments")
    op.drop_table("appointments")
