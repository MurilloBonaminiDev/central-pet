"""Alembic migration — appointment channel/source for multi-channel booking."""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0008_appointment_channel"
down_revision: Union[str, None] = "0007_clients_pets_history"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("appointments") as batch:
        batch.add_column(
            sa.Column(
                "source",
                sa.String(length=40),
                nullable=False,
                server_default="WEB",
            )
        )
        batch.add_column(
            sa.Column("external_message_id", sa.String(length=128), nullable=True)
        )

    op.create_index("ix_appointments_source", "appointments", ["source"])
    op.create_index(
        "ix_appointments_tenant_external_message",
        "appointments",
        ["tenant_id", "external_message_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_appointments_tenant_external_message", table_name="appointments")
    op.drop_index("ix_appointments_source", table_name="appointments")
    with op.batch_alter_table("appointments") as batch:
        batch.drop_column("external_message_id")
        batch.drop_column("source")
