from flask import Blueprint, request, jsonify
from models import MedicalRecord
from utils.auth_middleware import token_required

medical_record_bp = Blueprint('medical_record', __name__)  # Updated to match your __init__.py

@medical_record_bp.route('/', methods=['GET'])
@token_required
def get_medical_records(current_user):
    records = MedicalRecord.query.all()
    return jsonify([record.to_dict() for record in records]), 200

@medical_record_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_medical_record(current_user, id):
    record = MedicalRecord.query.get(id)
    if not record:
        return jsonify({"message": "Medical record not found"}), 404
    return jsonify(record.to_dict()), 200

@medical_record_bp.route('/', methods=['POST'])
@token_required
def create_medical_record(current_user):
    data = request.get_json()
    try:
        new_record = MedicalRecord(**data)
        new_record.save()
        return jsonify(new_record.to_dict()), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@medical_record_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_medical_record(current_user, id):
    data = request.get_json()
    record = MedicalRecord.query.get(id)
    if not record:
        return jsonify({"message": "Medical record not found"}), 404
    try:
        for key, value in data.items():
            setattr(record, key, value)
        record.save()
        return jsonify(record.to_dict()), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@medical_record_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_medical_record(current_user, id):
    record = MedicalRecord.query.get(id)
    if not record:
        return jsonify({"message": "Medical record not found"}), 404
    try:
        record.delete()
        return jsonify({"message": "Medical record deleted"}), 204
    except Exception as e:
        return jsonify({"message": str(e)}), 400
