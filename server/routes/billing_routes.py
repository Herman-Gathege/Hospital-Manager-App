from flask import Blueprint, request, jsonify
from models import Billing, BillingItem, Inventory, db
from utils.auth_middleware import token_required
from decimal import Decimal


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

# @billing_bp.route('/', methods=['POST'])
# @token_required
# def create_invoice(current_user):
#     data = request.get_json()
#     # print("Received Billing Data:", data)  # Debugging line
#     print(f"Received Billing Data: {data}")  # Debugging line


#     if not data:
#         return jsonify({"message": "Invalid input"}), 400

#     try:
#         new_invoice = Billing(
#             patient_id=data.get("patient_id"),  # Ensure snake_case
#             total_amount=data.get("total_amount")
#         )
#         db.session.add(new_invoice)
#         db.session.commit()
#         return jsonify(new_invoice.to_dict()), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": str(e)}), 400

@billing_bp.route('/', methods=['POST'])
@token_required
def create_invoice(current_user):
    data = request.get_json()
    print(f"Received Billing Data: {data}")  # Debugging

    if not data:
        return jsonify({"message": "Invalid input"}), 400

    missing_fields = []
    if "patient_id" not in data:
        missing_fields.append("patient_id")
    if "total_amount_due" not in data:
        missing_fields.append("total_amount_due")

    if missing_fields:
        return jsonify({"message": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    try:
        # Ensure total_amount_due is converted to Decimal
        total_amount_due = Decimal(str(data["total_amount_due"]))

        new_invoice = Billing(
            patient_id=data["patient_id"],
            total_amount_due=total_amount_due  # Store as Decimal
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
    data = request.get_json()

    patient_id = data.get("patient_id")
    items = data.get("items", [])

    if not patient_id or not items:
        return jsonify({"message": "Patient ID and items are required"}), 400

    total_cost = 0
    billing_items = []

    for item in items:
        drug_id = item.get("drug_id")
        quantity = item.get("quantity")

        drug = Inventory.query.get(drug_id)
        if not drug:
            return jsonify({"message": f"Drug with ID {drug_id} not found"}), 404

        if drug.stock < quantity:
            return jsonify({"message": f"Insufficient stock for {drug.name}"}), 400

        drug.stock -= quantity
        cost = drug.price * quantity
        total_cost += cost

        billing_item = BillingItem(inventory_id=drug_id, quantity=quantity, price=cost)
        billing_items.append(billing_item)

    new_billing = Billing(patient_id=patient_id, total_amount_due=total_cost)
    db.session.add(new_billing)
    db.session.flush()  # Get billing ID before committing

    for item in billing_items:
        item.billing_id = new_billing.id
        db.session.add(item)

    try:
        db.session.commit()
        return jsonify({"message": "Billing record added successfully", "billing": new_billing.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
