"""
añadimos la columna de destination_city para los vuelos
Revision ID: 567ced427324
Revises: c8d44ab147c1
Create Date: 2026-03-11 11:16:14.278857

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '567ced427324'
down_revision: Union[str, Sequence[str], None] = 'c8d44ab147c1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("flights", sa.Column("destination_city", sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("flights", "destination_city")
