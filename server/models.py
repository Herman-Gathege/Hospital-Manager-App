from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from sqlalchemy.dialects.postgresql import UUID, JSON
import uuid

bcrypt = Bcrypt()
db = SQLAlchemy()



class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, doctor, staff

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password).decode('utf-8')

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
    appointments = db.relationship(
        "Appointment", backref="patient", cascade="all, delete-orphan")

    # New: Medical records relationship
    medical_records = db.relationship(
        "MedicalRecord", backref="patient", cascade="all, delete-orphan")

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
    patient_id = db.Column(db.Integer, db.ForeignKey(
        'patients.id', ondelete="CASCADE"), nullable=False)
    doctor_id = db.Column(
        db.Integer, db.ForeignKey('users.id'), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    # scheduled, canceled, completed
    status = db.Column(db.String(20), default='scheduled')

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
    patient_id = db.Column(db.Integer, db.ForeignKey(
        'patients.id'), nullable=False)
    diagnosis = db.Column(db.String(255), nullable=False)
    prescription = db.Column(db.String(255), nullable=False)
    # units_prescribed = db.Column(db.Integer, nullable=False, default=0)  # New column
    units_prescribed = db.Column(JSON)  # ✅ allow dictionary of drug_id: quantity
    lab_results = db.Column(db.Text)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "diagnosis": self.diagnosis,
            "prescription": self.prescription,
            "units_prescribed": self.units_prescribed,
            "lab_results": self.lab_results,
            "date_created": self.date_created.isoformat() if self.date_created else None,
        }





class Billing(db.Model):
    __tablename__ = 'billing'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    invoice_number = db.Column(db.String(50), unique=True, nullable=False, default=lambda: str(uuid.uuid4())[:12])
    total_amount_due = db.Column(db.Numeric(10, 2), nullable=False)
    amount_paid = db.Column(db.Numeric(10, 2), default=0.00)
    status = db.Column(db.String(20), default='pending')  # pending, paid, overdue
    invoice_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(days=30))
    payment_method = db.Column(db.String(50), nullable=True)  # cash, insurance, card, etc.

    patient = db.relationship("Patient", backref="billings")  # Establish relationship
    billing_items = db.relationship("BillingItem", backref="billing", cascade="all, delete-orphan")

    def update_status(self):
        if self.amount_paid >= self.total_amount_due:
            self.status = "paid"
        elif self.due_date and datetime.utcnow() > self.due_date:
            self.status = "overdue"
        else:
            self.status = "pending"

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "patient_name": f"{self.patient.first_name} {self.patient.last_name}" if self.patient else "Unknown",
            "invoice_number": self.invoice_number,
            "total_amount_due": float(self.total_amount_due),
            "amount_paid": float(self.amount_paid),
            "status": self.status,
            "invoice_date": self.invoice_date.isoformat() if self.invoice_date else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "payment_method": self.payment_method,
            "billing_items": [item.to_dict() for item in self.billing_items]
        }
    



# Inventory Management
class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    drug_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    cost = db.Column(db.Float, nullable=False)  # New field to store the cost of the drug
    expiration_date = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "drug_name": self.drug_name,
            "quantity": self.quantity,
            "cost": self.cost,  # Include cost in the response
            "expiration_date": self.expiration_date.isoformat() if self.expiration_date else None
        }
    


class BillingItem(db.Model):
    __tablename__ = 'billing_items'
    
    id = db.Column(db.Integer, primary_key=True)
    billing_id = db.Column(db.Integer, db.ForeignKey('billing.id'), nullable=False)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)  # Reference to Inventory
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)  # Cost per unit of drug
    total_price = db.Column(db.Float, nullable=False)  # Computed total cost (quantity * unit_price)

    # Relationship with Inventory
    inventory = db.relationship("Inventory", backref="billing_items")

    def __init__(self, billing_id, inventory_id, quantity, unit_price=None):
        inventory_item = Inventory.query.get(inventory_id)
        if not inventory_item:
            raise ValueError("Invalid inventory item")

        if inventory_item.quantity < quantity:
            raise ValueError("Not enough stock available")

        self.billing_id = billing_id
        self.inventory_id = inventory_id
        self.quantity = quantity
        self.unit_price = unit_price if unit_price else inventory_item.cost  # ✅ Allow explicit unit_price or default to inventory price
        self.total_price = self.quantity * self.unit_price  # Calculate total price
        
        # Reduce inventory stock
        inventory_item.quantity -= quantity



    def to_dict(self):
        return {
            "id": self.id,
            "billing_id": self.billing_id,
            "drug_name": self.inventory.drug_name if self.inventory else "Unknown",
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "total_price": self.total_price
        }
    
    
    


# Staff and Doctor Management
class Staff(db.Model):
    __tablename__ = 'staff'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    # nurse, admin, lab_technician
    role = db.Column(db.String(20), nullable=False)
    shift = db.Column(db.String(50), nullable=False)
    attendance = db.Column(db.String(50), default='present')