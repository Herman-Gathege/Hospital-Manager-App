from flask import Blueprint, request, jsonify
from flask_cors import CORS  
from models import db, Inventory  # ✅ Import db for commit operations
from utils.auth_middleware import token_required

inventory_bp = Blueprint("inventory", __name__, url_prefix="/inventory")  
CORS(inventory_bp)  

# ✅ Get all inventory items
@inventory_bp.route('/all', methods=['GET'])  
@token_required
def get_inventory(current_user):
    items = Inventory.query.all()
    return jsonify([item.to_dict() for item in items]), 200

# ✅ Get a single inventory item by ID
@inventory_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_inventory_item(current_user, id):
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    return jsonify(item.to_dict()), 200

# ✅ Add a new inventory item
@inventory_bp.route('/add', methods=['POST'])  
@token_required
def add_inventory_item(current_user):
    data = request.get_json()
    try:
        new_item = Inventory(**data)
        db.session.add(new_item)  # ✅ Add item to session
        db.session.commit()  # ✅ Commit to DB
        return jsonify(new_item.to_dict()), 201
    except Exception as e:
        db.session.rollback()  # ✅ Rollback on failure
        return jsonify({"message": str(e)}), 400

# ✅ Update an inventory item
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
        db.session.commit()  # ✅ Commit changes
        return jsonify(item.to_dict()), 200
    except Exception as e:
        db.session.rollback()  # ✅ Rollback on error
        return jsonify({"message": str(e)}), 400

# ✅ Delete an inventory item
@inventory_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_inventory(current_user, id):
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    try:
        db.session.delete(item)  # ✅ Delete item
        db.session.commit()  # ✅ Commit changes
        return jsonify({"message": "Item deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()  # ✅ Rollback on error
        return jsonify({"message": str(e)}), 400
