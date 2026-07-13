"""Alembic migration — clients, pets and clinical history."""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0007_clients_pets_history"
down_revision: Union[str, None] = "0006_finance_transactions"
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
        "clients",
        sa.Column("id", uuid_type, primary_key=True, nullable=False),
        sa.Column("tenant_id", uuid_type, sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("phone", sa.String(length=40), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("tenant_id", "email", name="uq_clients_tenant_email"),
    )
    op.create_index("ix_clients_tenant_id", "clients", ["tenant_id"])
    op.create_index("ix_clients_email", "clients", ["email"])

    op.create_table(
        "pets",
        sa.Column("id", uuid_type, primary_key=True, nullable=False),
        sa.Column("tenant_id", uuid_type, sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("client_id", uuid_type, sa.ForeignKey("clients.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("species", sa.String(length=60), nullable=False),
        sa.Column("breed", sa.String(length=120), nullable=False, server_default=""),
        sa.Column("age_years", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_pets_tenant_id", "pets", ["tenant_id"])
    op.create_index("ix_pets_client_id", "pets", ["client_id"])

    op.create_table(
        "client_history",
        sa.Column("id", uuid_type, primary_key=True, nullable=False),
        sa.Column("tenant_id", uuid_type, sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("client_id", uuid_type, sa.ForeignKey("clients.id", ondelete="CASCADE"), nullable=False),
        sa.Column("pet_id", uuid_type, sa.ForeignKey("pets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("entry_type", sa.String(length=40), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("occurred_on", sa.Date(), nullable=False),
        sa.Column(
            "appointment_id",
            uuid_type,
            sa.ForeignKey("appointments.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_client_history_tenant_id", "client_history", ["tenant_id"])
    op.create_index("ix_client_history_client_id", "client_history", ["client_id"])
    op.create_index("ix_client_history_pet_id", "client_history", ["pet_id"])
    op.create_index("ix_client_history_entry_type", "client_history", ["entry_type"])
    op.create_index("ix_client_history_occurred_on", "client_history", ["occurred_on"])
    op.create_index("ix_client_history_appointment_id", "client_history", ["appointment_id"])


def downgrade() -> None:
    op.drop_index("ix_client_history_appointment_id", table_name="client_history")
    op.drop_index("ix_client_history_occurred_on", table_name="client_history")
    op.drop_index("ix_client_history_entry_type", table_name="client_history")
    op.drop_index("ix_client_history_pet_id", table_name="client_history")
    op.drop_index("ix_client_history_client_id", table_name="client_history")
    op.drop_index("ix_client_history_tenant_id", table_name="client_history")
    op.drop_table("client_history")

    op.drop_index("ix_pets_client_id", table_name="pets")
    op.drop_index("ix_pets_tenant_id", table_name="pets")
    op.drop_table("pets")

    op.drop_index("ix_clients_email", table_name="clients")
    op.drop_index("ix_clients_tenant_id", table_name="clients")
    op.drop_table("clients")
