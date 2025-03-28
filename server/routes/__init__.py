from flask import Blueprint
from .auth_routes import auth_bp
from .patient_routes import patient_bp
from .appointment_routes import appointment_bp
from .medical_routes import medical_record_bp
from .billing_routes import billing_bp
from .staff_routes import staff_bp
from .inventory_routes import inventory_bp
from .dashboard_routes import dashboard_bp

def register_routes(app):
    app.register_blueprint(patient_bp, url_prefix="/patients")
    app.register_blueprint(appointment_bp, url_prefix="/appointments")
    app.register_blueprint(medical_record_bp, url_prefix="/api/medical_record")
    app.register_blueprint(billing_bp, url_prefix="/api/billing")
    app.register_blueprint(staff_bp, url_prefix="/staff")
    app.register_blueprint(inventory_bp, url_prefix="/inventory")
    app.register_blueprint(dashboard_bp, url_prefix="/dashboard")
    app.register_blueprint(auth_bp, url_prefix="/auth")
