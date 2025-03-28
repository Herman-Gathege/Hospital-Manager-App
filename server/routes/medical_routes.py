from flask import Blueprint, request, jsonify
from models import MedicalRecord, db
from utils.auth_middleware import token_required
from datetime import datetime

medical_record_bp = Blueprint('medical_record', __name__)

# Get all medical records
@medical_record_bp.route('/', methods=['GET'])
@token_required
def get_medical_records(current_user):
    try:
        records = MedicalRecord.query.all()
        return jsonify([record.to_dict() for record in records]), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

# Get a specific medical record by ID
@medical_record_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_medical_record(current_user, id):
    try:
        record = MedicalRecord.query.get(id)
        if not record:
            return jsonify({"message": "Medical record not found"}), 404
        return jsonify(record.to_dict()), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

# Create a new medical record (only for doctors)
@medical_record_bp.route('/', methods=['POST'])
@token_required
def create_medical_record(current_user):
    if current_user.role != "doctor":
        return jsonify({"message": "Only doctors can add medical records"}), 403

    data = request.get_json()
    print("Received data:", data)  # Log incoming data

    try:
        diagnosis = data.get("diagnosis")
        prescription = data.get("prescription")
        lab_results = data.get("lab_results")
        patient_id = data.get("patient_id")
        units_prescribed = data.get("units_prescribed")

        # Validate required fields
        if not diagnosis or not prescription or not patient_id:
            return jsonify({"message": "Diagnosis, prescription, and patient ID are required"}), 400

        new_record = MedicalRecord(
            patient_id=patient_id,
            diagnosis=diagnosis,
            prescription=prescription,
            units_prescribed=units_prescribed,
            lab_results=lab_results,
            date_created=datetime.utcnow()
        )

        db.session.add(new_record)
        db.session.commit()

        print("Medical record created successfully!")  # Success message
        return jsonify(new_record.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating medical record: {str(e)}")  # Log the error message
        return jsonify({"message": str(e)}), 400

# Update an existing medical record
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
        db.session.commit()
        return jsonify(record.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

# Delete a medical record
@medical_record_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_medical_record(current_user, id):
    record = MedicalRecord.query.get(id)
    if not record:
        return jsonify({"message": "Medical record not found"}), 404
    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Medical record deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


@medical_record_bp.route('/medical_record/update', methods=['POST'])
@token_required
def link_medical_record(current_user):
    """
    Updates a medical record to link it with billing.
    """
    data = request.get_json()
    
    patient_id = data.get("patient_id")
    prescription_id = data.get("prescription_id")
    billing_id = data.get("billing_id")

    if not all([patient_id, prescription_id, billing_id]):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        # Update medical record (assuming you have a MedicalRecord model)
        medical_record = MedicalRecord.query.filter_by(patient_id=patient_id, prescription_id=prescription_id).first()
        if not medical_record:
            return jsonify({"message": "Medical record not found"}), 404

        medical_record.billing_id = billing_id
        db.session.commit()
        return jsonify({"message": "Medical record updated with billing info"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
