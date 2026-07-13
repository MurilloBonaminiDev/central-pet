"""Alembic migration — catalog products table."""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003_catalog_products"
down_revision: Union[str, None] = "0002_catalog_services"
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
        "products",
        sa.Column("id", uuid_type, primary_key=True, nullable=False),
        sa.Column("tenant_id", uuid_type, sa.ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False),
        sa.Column("slug", sa.String(length=80), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=60), nullable=False),
        sa.Column("image_url", sa.String(length=512), nullable=False),
        sa.Column("image_alt", sa.String(length=200), nullable=False),
        sa.Column("price_cents", sa.Integer(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=true),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=now, nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("tenant_id", "slug", name="uq_products_tenant_slug"),
    )
    op.create_index("ix_products_tenant_id", "products", ["tenant_id"])
    op.create_index("ix_products_category", "products", ["category"])
    op.create_index("ix_products_tenant_active", "products", ["tenant_id", "is_active", "sort_order"])


def downgrade() -> None:
    op.drop_index("ix_products_tenant_active", table_name="products")
    op.drop_index("ix_products_category", table_name="products")
    op.drop_index("ix_products_tenant_id", table_name="products")
    op.drop_table("products")
