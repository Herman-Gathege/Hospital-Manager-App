

from flask import Blueprint, request, jsonify
from flask_cors import CORS  
from models import db, Inventory
from datetime import datetime
from utils.auth_middleware import token_required

inventory_bp = Blueprint("inventory", __name__, url_prefix="/inventory")  
CORS(inventory_bp)  

# Get all inventory items
@inventory_bp.route('/all', methods=['GET'])  
@token_required
def get_inventory(current_user):
    items = Inventory.query.all()
    return jsonify([item.to_dict() for item in items]), 200



#  Get a single inventory item by ID
@inventory_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_inventory_item(current_user, id):
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    return jsonify(item.to_dict()), 200



@inventory_bp.route('/add', methods=['POST'])  
@token_required
def add_inventory_item(current_user):
    data = request.get_json()
    try:
        # Convert date strings to Python date objects
        if "date_added" in data:
            data["date_added"] = datetime.strptime(data["date_added"], "%Y-%m-%d").date()
        
        if "expiration_date" in data:  # Ensure expiration_date is converted
            data["expiration_date"] = datetime.strptime(data["expiration_date"], "%Y-%m-%d").date()

        new_item = Inventory(**data)
        db.session.add(new_item)
        db.session.commit()
        return jsonify(new_item.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400




#  Delete an inventory item
@inventory_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_inventory_item(current_user, id):
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400




@inventory_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_inventory_item(current_user, id):
    data = request.get_json()
    item = Inventory.query.get(id)

    if not item:
        return jsonify({"message": "Item not found"}), 404

    try:
        # Convert expiration_date string to a date object if present
        if "expiration_date" in data and isinstance(data["expiration_date"], str):
            data["expiration_date"] = datetime.strptime(data["expiration_date"], "%Y-%m-%d").date()

        for key, value in data.items():
            setattr(item, key, value)

        db.session.commit()
        return jsonify(item.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
