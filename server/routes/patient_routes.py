from flask import Blueprint, request, jsonify
from models import Patient, db
from utils.auth_middleware import token_required
from datetime import datetime


patient_bp = Blueprint('patient', __name__)  # Updated to match your __init__.py

@patient_bp.route('/', methods=['GET'])
@token_required
def get_all_patients(current_user):
    patients = Patient.query.all()
    return jsonify([patient.to_dict() for patient in patients]), 200

@patient_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_patient(current_user, id):
    patient = Patient.query.get(id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
    return jsonify(patient.to_dict()), 200



@patient_bp.route('/', methods=['POST'])
@token_required
def create_patient(current_user):
    try:
        # Log the incoming form data
        print("Received data:", request.form)
        print("Received files:", request.files)

        # Extract data from the form
        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        dob_str = request.form.get("dob")
        gender = request.form.get("gender")
        phone_number = request.form.get("phone_number")
        address = request.form.get("address")
        medical_history = request.form.get("medical_history")
        blood_group = request.form.get("blood_group")
        allergies = request.form.get("allergies")
        chronic_conditions = request.form.get("chronic_conditions")
        doctor = request.form.get("doctor")

        # Check if all necessary fields are present
        if not all([first_name, last_name, dob_str, gender, phone_number, address]):
            return jsonify({"message": "Missing required fields"}), 400

        # Convert dob to a date object
        try:
            dob = datetime.strptime(dob_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400

        # Handle file upload (if any)
        image = request.files.get("image")
        image_path = None
        if image:
            image_path = f"uploads/{image.filename}"
            image.save(image_path)

        # Create a new patient object
        new_patient = Patient(
            first_name=first_name,
            last_name=last_name,
            dob=dob,
            gender=gender,
            phone_number=phone_number,
            address=address,
            medical_history=medical_history,
            blood_group=blood_group,
            allergies=allergies,
            chronic_conditions=chronic_conditions,
            doctor=doctor,
            image_path=image_path
        )

        # Add the new patient to the session and commit
        db.session.add(new_patient)
        db.session.commit()

        return jsonify(new_patient.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))  # Log the error message
        return jsonify({"message": str(e)}), 400




@patient_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_patient(current_user, id):
    data = request.get_json()
    patient = Patient.query.get(id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
    try:
        for key, value in data.items():
            setattr(patient, key, value)
        patient.save()
        return jsonify(patient.to_dict()), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@patient_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_patient(current_user, id):
    patient = Patient.query.get(id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
    try:
        patient.delete()
        return jsonify({"message": "Patient deleted"}), 204
    except Exception as e:
        return jsonify({"message": str(e)}), 400
