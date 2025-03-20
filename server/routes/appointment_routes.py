from flask import Blueprint, request, jsonify
from models import Appointment
from utils.auth_middleware import token_required

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
        new_appointment = Appointment(**data)
        new_appointment.save()
        return jsonify(new_appointment.to_dict()), 201
    except Exception as e:
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
        appointment.save()
        return jsonify(appointment.to_dict()), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@appointment_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user, id):
    appointment = Appointment.query.get(id)
    if not appointment:
        return jsonify({"message": "Appointment not found"}), 404
    try:
        appointment.delete()
        return jsonify({"message": "Appointment deleted"}), 204
    except Exception as e:
        return jsonify({"message": str(e)}), 400
