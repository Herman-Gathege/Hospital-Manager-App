from flask import Blueprint, request, jsonify
from models import Patient, db, User
from utils.auth_middleware import token_required
from datetime import datetime


patient_bp = Blueprint('patient', __name__)  

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
        doctor_id = request.form.get("doctor")  # Get the doctor ID instead of name

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

        # Verify that the doctor ID exists
        doctor = User.query.get(doctor_id)
        if not doctor:
            return jsonify({"message": "Doctor not found"}), 404

        # Create a new patient object with the correct doctor ID
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
            doctor_id=doctor.id,  # Store doctor ID
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
            # Convert date strings to date objects if key is 'dob'
            if key == "dob" and isinstance(value, str):
                try:
                    value = datetime.strptime(value, "%Y-%m-%d").date()
                except ValueError:
                    return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400
            # Update doctor_id correctly
            if key == "doctor":
                doctor = User.query.get(value)
                if not doctor:
                    return jsonify({"message": "Doctor not found"}), 404
                setattr(patient, "doctor_id", doctor.id)
            else:
                setattr(patient, key, value)

        db.session.commit()
        return jsonify(patient.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


@patient_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_patient(current_user, id):
    patient = Patient.query.get(id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404
    try:
        db.session.delete(patient)  # Correct deletion statement
        db.session.commit()  # Commit the change
        print(f"Deleted patient with ID {id}")  # Debugging line
        return jsonify({"message": "Patient deleted"}), 204
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting patient with ID {id}: {str(e)}")  # Detailed error message
        return jsonify({"message": str(e)}), 400


@patient_bp.route('/doctors', methods=['GET'])
@token_required
def get_doctors(current_user):
    try:
        # Fetch all users with the role 'doctor'
        doctors = User.query.filter_by(role="doctor").all()
        doctor_list = [{"id": doctor.id, "username": doctor.username} for doctor in doctors]
        return jsonify(doctor_list), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400