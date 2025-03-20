from flask import Blueprint, request, jsonify
from models import Billing
from utils.auth_middleware import token_required

billing_bp = Blueprint('billing', __name__)  # Updated to match your __init__.py

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
    try:
        new_invoice = Billing(**data)
        new_invoice.save()
        return jsonify(new_invoice.to_dict()), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@billing_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_invoice(current_user, id):
    data = request.get_json()
    invoice = Billing.query.get(id)
    if not invoice:
        return jsonify({"message": "Invoice not found"}), 404
    try:
        for key, value in data.items():
            setattr(invoice, key, value)
        invoice.save()
        return jsonify(invoice.to_dict()), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@billing_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_invoice(current_user, id):
    invoice = Billing.query.get(id)
    if not invoice:
        return jsonify({"message": "Invoice not found"}), 404
    try:
        invoice.delete()
        return jsonify({"message": "Invoice deleted"}), 204
    except Exception as e:
        return jsonify({"message": str(e)}), 400
