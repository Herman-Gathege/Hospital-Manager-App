"""Add cascading delete for appointments

Revision ID: 74c836109967
Revises: 51408197c0e6
Create Date: 2025-03-22 15:01:33.068374

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '74c836109967'
down_revision = '51408197c0e6'
branch_labels = None
depends_on = None


def upgrade():
    # Create a temporary table with the new constraint
    op.create_table(
        'appointments_temp',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('patient_id', sa.Integer, sa.ForeignKey('patients.id', ondelete='CASCADE')),
        sa.Column('doctor_id', sa.Integer, sa.ForeignKey('users.id')),
        sa.Column('appointment_date', sa.DateTime, nullable=False),
        sa.Column('status', sa.String(20), default='scheduled')
    )

    # Copy data from the old table to the new table
    op.execute('''
        INSERT INTO appointments_temp (id, patient_id, doctor_id, appointment_date, status)
        SELECT id, patient_id, doctor_id, appointment_date, status
        FROM appointments
    ''')

    # Drop the old table
    op.drop_table('appointments')

    # Rename the new table to the old table name
    op.rename_table('appointments_temp', 'appointments')


def downgrade():
    # Create the original appointments table without cascading delete
    op.create_table(
        'appointments_temp',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('patient_id', sa.Integer, sa.ForeignKey('patients.id')),
        sa.Column('doctor_id', sa.Integer, sa.ForeignKey('users.id')),
        sa.Column('appointment_date', sa.DateTime, nullable=False),
        sa.Column('status', sa.String(20), default='scheduled')
    )

    # Copy data from the current table to the old table
    op.execute('''
        INSERT INTO appointments_temp (id, patient_id, doctor_id, appointment_date, status)
        SELECT id, patient_id, doctor_id, appointment_date, status
        FROM appointments
    ''')

    # Drop the current table
    op.drop_table('appointments')

    # Rename the temporary table back to the original table name
    op.rename_table('appointments_temp', 'appointments')
