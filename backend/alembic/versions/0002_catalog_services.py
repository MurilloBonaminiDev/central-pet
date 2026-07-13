"""Alembic migration — catalog services table."""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002_catalog_services"
down_revision: Union[str, None] = "0001_auth"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _uuid() -> sa.Uuid:
    return sa.Uuid(as_uuid=True)


def _now_default() -> sa.TextClause:
    bind = op.get_bind()
    if bind.dialect.name == "sqlite":
        return sa.text("(CURRENT_TIMESTAMP)")
    return sa.text("now()")


def _bool_true() -> sa.TextClause:
    bind = op.get_bind()
    if bind.dialect.name == "sqlite":
        return sa.text("1")
    return sa.text("true")


def upgrade() -> None:
    uuid_type = _uuid()
    now = _now_default()
    true = _bool_true()

    op.create_table(
        "services",
        sa.Column("id", uuid_type, primary_key=True, nullable=False),
        sa.Column("tenant_id", uuid_type, sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("slug", sa.String(length=80), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("image_url", sa.String(length=512), nullable=False),
        sa.Column("image_alt", sa.String(length=200), nullable=False),
        sa.Column("price_cents", sa.Integer(), nullable=True),
        sa.Column("duration_minutes", sa.Integer(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=true),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("tenant_id", "slug", name="uq_services_tenant_slug"),
    )
    op.create_index("ix_services_tenant_id", "services", ["tenant_id"])
    op.create_index("ix_services_tenant_active", "services", ["tenant_id", "is_active", "sort_order"])


def downgrade() -> None:
    op.drop_index("ix_services_tenant_active", table_name="services")
    op.drop_index("ix_services_tenant_id", table_name="services")
    op.drop_table("services")
