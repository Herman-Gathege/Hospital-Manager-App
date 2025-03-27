from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
db = SQLAlchemy()

# User Authentication and Role-Based Access Control (RBAC)
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, doctor, staff

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)




# Patient Management
class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    medical_history = db.Column(db.Text)
    check_in_date = db.Column(db.DateTime, default=datetime.utcnow)
    discharge_date = db.Column(db.DateTime, nullable=True)

    # New fields to match your form data
    blood_group = db.Column(db.String(10))
    allergies = db.Column(db.Text)
    chronic_conditions = db.Column(db.Text)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    doctor = db.relationship('User', backref='patients')
    image_path = db.Column(db.String(255))

    # Cascade delete appointments when a patient is deleted
    appointments = db.relationship("Appointment", backref="patient", cascade="all, delete-orphan")

    # New: Medical records relationship
    medical_records = db.relationship("MedicalRecord", backref="patient", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "dob": self.dob.isoformat() if self.dob else None,
            "gender": self.gender,
            "phone_number": self.phone_number,
            "address": self.address,
            "medical_history": self.medical_history,
            "check_in_date": self.check_in_date.isoformat() if self.check_in_date else None,
            "discharge_date": self.discharge_date.isoformat() if self.discharge_date else None,
            "blood_group": self.blood_group,
            "allergies": self.allergies,
            "chronic_conditions": self.chronic_conditions,
            "doctor_name": self.doctor.username if self.doctor else "N/A",
            "image_path": self.image_path,
            # Include medical records in the response
            "medical_records": [record.to_dict() for record in self.medical_records]
        }



# Appointment Scheduling
class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id', ondelete="CASCADE"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='scheduled')  # scheduled, canceled, completed

    # Establish relationships with Patient and User (Doctor)
    doctor = db.relationship("User", backref="appointments")

    def to_dict(self):
        return {
            "id": self.id,
            "patient_name": f"{self.patient.first_name} {self.patient.last_name}",
            "doctor_name": self.doctor.username,
            "appointment_date": self.appointment_date.isoformat() if self.appointment_date else None,
            "status": self.status
        }




# Medical Records Management
class MedicalRecord(db.Model):
    __tablename__ = 'medical_records'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    diagnosis = db.Column(db.String(255), nullable=False)
    prescription = db.Column(db.String(255), nullable=False)
    lab_results = db.Column(db.Text)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "diagnosis": self.diagnosis,
            "prescription": self.prescription,
            "lab_results": self.lab_results,
            "date_created": self.date_created.isoformat() if self.date_created else None,
        }


# Billing and Payments
class Billing(db.Model):
    __tablename__ = 'billing'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    amount_due = db.Column(db.Float, nullable=False)
    amount_paid = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='pending')  # pending, paid, overdue
    invoice_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "amount_due": self.amount_due,
            "amount_paid": self.amount_paid,
            "status": self.status,
            "invoice_date": self.invoice_date.isoformat()
        }


# Staff and Doctor Management
class Staff(db.Model):
    __tablename__ = 'staff'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # nurse, admin, lab_technician
    shift = db.Column(db.String(50), nullable=False)
    attendance = db.Column(db.String(50), default='present')


# Inventory Management
class Inventory(db.Model):
    __tablename__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    supplier = db.Column(db.String(100), nullable=True)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "item_name": self.item_name,
            "quantity": self.quantity,
            "supplier": self.supplier,
            "last_updated": self.last_updated.isoformat() if self.last_updated else None
        }
