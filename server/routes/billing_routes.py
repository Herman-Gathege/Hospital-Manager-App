from flask import Blueprint, request, jsonify
from models import Billing, BillingItem, Inventory, db
from utils.auth_middleware import token_required

billing_bp = Blueprint('billing', __name__)  # Ensure it matches __init__.py

@billing_bp.route('/', methods=['GET'])
@token_required
def get_invoices(current_user):
    invoices = Billing.query.all()
    return jsonify([invoice.to_dict() for invoice in invoices]), 200

@billing_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_invoice(current_user, id):
    invoice = Billing.query.get(id)
    if not invoice:
        return jsonify({"message": "Invoice not found"}), 404
    return jsonify(invoice.to_dict()), 200

# @billing_bp.route('/', methods=['POST'])
# @token_required
# def create_invoice(current_user):
#     data = request.get_json()
#     if not data:
#         return jsonify({"message": "Invalid input"}), 400
    
#     try:
#         new_invoice = Billing(**data)
#         db.session.add(new_invoice)
#         db.session.commit()
#         return jsonify(new_invoice.to_dict()), 201
#     except Exception as e:
#         db.session.rollback()  # Rollback in case of error
#         return jsonify({"message": str(e)}), 400

@billing_bp.route('/', methods=['POST'])
@token_required
def create_invoice(current_user):
    data = request.get_json()
    # print("Received Billing Data:", data)  # Debugging line
    print(f"Received Billing Data: {data}")  # Debugging line


    if not data:
        return jsonify({"message": "Invalid input"}), 400

    try:
        new_invoice = Billing(
            patient_id=data.get("patient_id"),  # Ensure snake_case
            total_amount=data.get("total_amount")
        )
        db.session.add(new_invoice)
        db.session.commit()
        return jsonify(new_invoice.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400


@billing_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_invoice(current_user, id):
    invoice = Billing.query.get(id)
    if not invoice:
        return jsonify({"message": "Invoice not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid input"}), 400

    try:
        for key, value in data.items():
            setattr(invoice, key, value)
        db.session.commit()
        return jsonify(invoice.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

@billing_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_invoice(current_user, id):
    invoice = Billing.query.get(id)
    if not invoice:
        return jsonify({"message": "Invoice not found"}), 404

    try:
        db.session.delete(invoice)
        db.session.commit()
        return jsonify({"message": "Invoice deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

@billing_bp.route('/add', methods=['POST'])
@token_required
def create_invoice_with_items(current_user):
    """
    Create a billing invoice when a doctor prescribes medication.
    - Checks inventory
    - Deducts stock
    - Calculates total cost
    - Stores billing record
    """
    data = request.get_json()
    
    patient_id = data.get("patient_id")
    items = data.get("items", [])  # Expected: [{drug_id, quantity}]

    if not patient_id or not items:
        return jsonify({"message": "Patient ID and items are required"}), 400

    total_cost = 0
    billing_items = []

    for item in items:
        drug_id = item.get("drug_id")
        quantity = item.get("quantity")

        # Check if drug exists in inventory
        drug = Inventory.query.get(drug_id)
        if not drug:
            return jsonify({"message": f"Drug with ID {drug_id} not found"}), 404

        # Check stock availability
        if drug.stock < quantity:
            return jsonify({"message": f"Insufficient stock for {drug.name}"}), 400

        # Deduct from inventory
        drug.stock -= quantity

        # Calculate cost
        cost = drug.price * quantity
        total_cost += cost

        # Create a BillingItem
        billing_item = BillingItem(drug_id=drug_id, quantity=quantity, price=cost)
        billing_items.append(billing_item)

    # Create the Billing record
    new_billing = Billing(patient_id=patient_id, total_amount=total_cost, items=billing_items)

    try:
        db.session.add(new_billing)
        db.session.commit()
        return jsonify({"message": "Billing record added successfully", "billing": new_billing.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500