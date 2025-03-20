from flask import Blueprint, request, jsonify
from models import Inventory
from utils.auth_middleware import token_required

inventory_bp = Blueprint('inventory', __name__)  # Updated to match your __init__.py

@inventory_bp.route('/', methods=['GET'])
@token_required
def get_inventory(current_user):
    items = Inventory.query.all()
    return jsonify([item.to_dict() for item in items]), 200

@inventory_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_inventory_item(current_user, id):
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    return jsonify(item.to_dict()), 200

@inventory_bp.route('/', methods=['POST'])
@token_required
def add_inventory_item(current_user):
    data = request.get_json()
    try:
        new_item = Inventory(**data)
        new_item.save()
        return jsonify(new_item.to_dict()), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@inventory_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_inventory(current_user, id):
    data = request.get_json()
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    try:
        for key, value in data.items():
            setattr(item, key, value)
        item.save()
        return jsonify(item.to_dict()), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@inventory_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_inventory(current_user, id):
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    try:
        item.delete()
        return jsonify({"message": "Item deleted"}), 204
    except Exception as e:
        return jsonify({"message": str(e)}), 400
