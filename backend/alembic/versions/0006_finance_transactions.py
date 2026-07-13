"""Alembic migration — finance transactions ledger."""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0006_finance_transactions"
down_revision: Union[str, None] = "0005_appointment_price"
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
        "finance_transactions",
        sa.Column("id", uuid_type, primary_key=True, nullable=False),
        sa.Column("tenant_id", uuid_type, sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type", sa.String(length=20), nullable=False),
        sa.Column("category", sa.String(length=40), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=False),
        sa.Column("amount_cents", sa.Integer(), nullable=False),
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
    op.create_index("ix_finance_transactions_tenant_id", "finance_transactions", ["tenant_id"])
    op.create_index("ix_finance_transactions_type", "finance_transactions", ["type"])
    op.create_index("ix_finance_transactions_category", "finance_transactions", ["category"])
    op.create_index("ix_finance_transactions_occurred_on", "finance_transactions", ["occurred_on"])
    op.create_index("ix_finance_transactions_appointment_id", "finance_transactions", ["appointment_id"])
    op.create_index(
        "ix_finance_transactions_tenant_date",
        "finance_transactions",
        ["tenant_id", "occurred_on"],
    )


def downgrade() -> None:
    op.drop_index("ix_finance_transactions_tenant_date", table_name="finance_transactions")
    op.drop_index("ix_finance_transactions_appointment_id", table_name="finance_transactions")
    op.drop_index("ix_finance_transactions_occurred_on", table_name="finance_transactions")
    op.drop_index("ix_finance_transactions_category", table_name="finance_transactions")
    op.drop_index("ix_finance_transactions_type", table_name="finance_transactions")
    op.drop_index("ix_finance_transactions_tenant_id", table_name="finance_transactions")
    op.drop_table("finance_transactions")
