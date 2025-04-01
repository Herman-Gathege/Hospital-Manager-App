from flask import Blueprint, request, jsonify
from models import Billing, BillingItem, Inventory, db
from utils.auth_middleware import token_required
from decimal import Decimal
from collections import defaultdict
from datetime import datetime


billing_bp = Blueprint('billing', __name__)  
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




@billing_bp.route('/', methods=['POST'])
@token_required
def create_invoice(current_user):
    data = request.get_json()

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
    

    
@billing_bp.route('/<int:billing_id>', methods=['PUT'])
@token_required
def update_billing_status(current_user, billing_id):
    billing = Billing.query.get(billing_id)
    if not billing:
        return jsonify({"message": "Billing record not found"}), 404

    data = request.get_json()
    new_status = data.get("status")

    if not new_status:
        return jsonify({"message": "Status is required"}), 400

    billing.status = new_status
    db.session.commit()

    return jsonify({"message": "Billing status updated successfully", "billing": billing.to_dict()}), 200




@billing_bp.route('/api/paid-bills', methods=['GET'])
@token_required
def get_paid_bills(current_user):
    paid_bills = Billing.query.filter_by(status="paid").all()
    
    revenue_by_month = defaultdict(float)
    
    for bill in paid_bills:
        month = bill.invoice_date.strftime("%Y-%m")  # Extract "YYYY-MM"
        revenue_by_month[month] += float(bill.amount_paid)
    
    revenue_data = [{"month": month, "revenue": revenue_by_month[month]} for month in sorted(revenue_by_month)]
    
    return jsonify(revenue_data), 200
