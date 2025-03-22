from flask import Blueprint, request, jsonify
from models import User, db, Appointment
from utils.auth_middleware import token_required
from datetime import datetime


appointment_bp = Blueprint('appointment', __name__)  # Updated to match your __init__.py

@appointment_bp.route('/', methods=['GET'])
@token_required
def get_appointments(current_user):
    appointments = Appointment.query.all()
    return jsonify([appointment.to_dict() for appointment in appointments]), 200

@appointment_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_appointment(current_user, id):
    appointment = Appointment.query.get(id)
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404
    return jsonify(appointment.to_dict()), 200

@appointment_bp.route('/', methods=['POST'])
@token_required
def create_appointment(current_user):
    data = request.get_json()
    try:
        # Extract the fields that match your model
        patient_id = data.get("patient_id")
        doctor_id = data.get("doctor_id")
        appointment_date = data.get("appointment_date")
        status = data.get("status")

        # Convert appointment_date to a datetime object
        if appointment_date:
            appointment_date = datetime.fromisoformat(appointment_date)

        # Validate required fields
        if not all([patient_id, doctor_id, appointment_date, status]):
            return jsonify({"message": "Missing required fields"}), 400
        
        # Check if doctor exists and is a valid doctor
        doctor = User.query.get(doctor_id)
        if not doctor or doctor.role != "doctor":
            return jsonify({"message": "Invalid doctor ID or user is not a doctor"}), 404

        # Create the appointment
        new_appointment = Appointment(
            patient_id=patient_id,
            doctor_id=doctor_id,
            appointment_date=appointment_date,
            status=status
        )

        db.session.add(new_appointment)
        db.session.commit()

        return jsonify(new_appointment.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

@appointment_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_appointment(current_user, id):
    data = request.get_json()
    appointment = Appointment.query.get(id)
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404
    try:
        for key, value in data.items():
            setattr(appointment, key, value)
        db.session.commit()  # Save the changes to the database
        return jsonify(appointment.to_dict()), 200
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"message": str(e)}), 400

@appointment_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user, id):
    appointment = Appointment.query.get(id)
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404
    try:
        db.session.delete(appointment)  # Delete the appointment
        db.session.commit()  # Save the changes
        return jsonify({"message": "Appointment deleted"}), 204
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"message": str(e)}), 400


@appointment_bp.route('/doctors', methods=['GET'])
@token_required
def get_doctors(current_user):
    try:
        # Fetch all users with the role 'doctor'
        doctors = User.query.filter_by(role="doctor").all()
        doctor_list = [{"id": doctor.id, "username": doctor.username} for doctor in doctors]
        return jsonify(doctor_list), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400
