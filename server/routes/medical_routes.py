import json
from flask import Blueprint, request, jsonify
from models import MedicalRecord, Billing, BillingItem, Inventory, Patient, db
from utils.auth_middleware import token_required
from datetime import datetime
import logging


medical_record_bp = Blueprint('medical_record', __name__)
logging.basicConfig(level=logging.INFO)

# Get all medical records
@medical_record_bp.route('/', methods=['GET'])
@token_required
def get_medical_records(current_user):
    try:
        records = MedicalRecord.query.all()
        return jsonify([record.to_dict() for record in records]), 200
    except Exception as e:
        logging.error(f"Error fetching medical records: {str(e)}")
        return jsonify({"message": str(e)}), 400
    


# Get a specific medical record by ID
@medical_record_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_medical_record(current_user, id):
    try:
        record = MedicalRecord.query.get_or_404(id)
        return jsonify(record.to_dict()), 200
    except Exception as e:
        logging.error(f"Error fetching medical record {id}: {str(e)}")
        return jsonify({"message": str(e)}), 400





@medical_record_bp.route('/', methods=['POST'])
@token_required
def create_medical_record(current_user):
    if current_user.role != "doctor":
        return jsonify({"message": "Only doctors can add medical records"}), 403

    data = request.get_json()
    try:
        diagnosis = data.get("diagnosis")
        prescription = data.get("prescription")  # List of drug IDs
        patient_id = data.get("patient_id")
        units_prescribed = data.get("units_prescribed", {})  # Default to empty dict
        lab_results = data.get("lab_results", {})

        if not diagnosis or not prescription or not patient_id:
            return jsonify({"message": "Diagnosis, prescription, and patient ID are required"}), 400

        # Ensure patient exists
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({"message": "Patient not found"}), 404

        # Step 1: Create Medical Record
        new_record = MedicalRecord(
            patient_id=patient_id,
            diagnosis=diagnosis,
            prescription=prescription,  #  Store as JSON
            units_prescribed=json.dumps(units_prescribed),  #  Store as JSON
            lab_results=lab_results,
            date_created=datetime.utcnow()
        )
        db.session.add(new_record)
        db.session.flush()  #  Flush to assign ID without committing

        # Step 2: Generate Billing
        total_cost = 0
        billing_items = []

        for inventory_id, quantity in units_prescribed.items():
            inventory_item = Inventory.query.get(inventory_id)
            if not inventory_item:
                return jsonify({"message": f"Drug ID {inventory_id} not found in inventory"}), 404

            drug_cost = inventory_item.cost * quantity
            total_cost += drug_cost  #  Update total cost

        # Step 3: Create Billing Entry and Commit First
        billing = Billing(
            patient_id=patient_id,
            total_amount_due=total_cost,
            status="pending",
            invoice_date=datetime.utcnow()
        )
        db.session.add(billing)
        db.session.commit()  #  Save billing to get the ID

        # Step 4: Create BillingItem Entries with Valid Billing ID
        for inventory_id, quantity in units_prescribed.items():
            inventory_item = Inventory.query.get(inventory_id)
            billing_item = BillingItem(
                billing_id=billing.id,  #  Now we have a valid billing ID
                inventory_id=inventory_id,
                quantity=quantity,
                unit_price=inventory_item.cost
            )
            db.session.add(billing_item)
            billing_items.append(billing_item)

        db.session.commit()  #  Save all billing items

        return jsonify({
            "medical_record": new_record.to_dict(),
            "billing": billing.to_dict(),
            "billing_items": [item.to_dict() for item in billing_items]
        }), 201

    except Exception as e:
        db.session.rollback()  #  Rollback in case of failure
        return jsonify({"message": str(e)}), 400
    



# Update an existing medical record (only for doctors)
@medical_record_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_medical_record(current_user, id):
    if current_user.role != "doctor":
        return jsonify({"message": "Only doctors can modify medical records"}), 403
    
    data = request.get_json()
    record = MedicalRecord.query.get_or_404(id)
    try:
        allowed_updates = {"diagnosis", "prescription", "units_prescribed", "lab_results"}
        for key, value in data.items():
            if key in allowed_updates:
                setattr(record, key, value)
        db.session.commit()
        return jsonify(record.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating medical record {id}: {str(e)}")
        return jsonify({"message": str(e)}), 400
    


# Delete a medical record (only for doctors)
@medical_record_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_medical_record(current_user, id):
    if current_user.role != "doctor":
        return jsonify({"message": "Only doctors can delete medical records"}), 403
    
    record = MedicalRecord.query.get_or_404(id)
    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Medical record deleted"}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting medical record {id}: {str(e)}")
        return jsonify({"message": str(e)}), 400
    


# Link medical record with billing
@medical_record_bp.route('/medical_record/update', methods=['POST'])
@token_required
def link_medical_record(current_user):
    data = request.get_json()
    patient_id = data.get("patient_id")
    prescription_id = data.get("prescription_id")
    billing_id = data.get("billing_id")

    if not all([patient_id, prescription_id, billing_id]):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        medical_record = MedicalRecord.query.filter_by(patient_id=patient_id, prescription_id=prescription_id).first_or_404()
        medical_record.billing_id = billing_id
        db.session.commit()
        return jsonify({"message": "Medical record updated with billing info"}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error updating medical record with billing info: {str(e)}")
        return jsonify({"message": str(e)}), 500
