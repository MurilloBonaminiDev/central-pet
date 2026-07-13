"""Alembic migration — appointment price snapshot for revenue stats."""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0005_appointment_price"
down_revision: Union[str, None] = "0004_appointments"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("appointments", sa.Column("price_cents", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("appointments", "price_cents")
