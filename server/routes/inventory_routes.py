# from flask import Blueprint, request, jsonify
# from flask_cors import CORS  
# from models import db, Inventory  # ✅ Import db for commit operations
# from utils.auth_middleware import token_required

# inventory_bp = Blueprint("inventory", __name__, url_prefix="/inventory")  
# CORS(inventory_bp)  

# # ✅ Get all inventory items
# @inventory_bp.route('/all', methods=['GET'])  
# @token_required
# def get_inventory(current_user):
#     items = Inventory.query.all()
#     return jsonify([item.to_dict() for item in items]), 200

# # ✅ Get a single inventory item by ID
# @inventory_bp.route('/<int:id>', methods=['GET'])
# @token_required
# def get_inventory_item(current_user, id):
#     item = Inventory.query.get(id)
#     if not item:
#         return jsonify({"message": "Item not found"}), 404
#     return jsonify(item.to_dict()), 200

# # ✅ Add a new inventory item
# @inventory_bp.route('/add', methods=['POST'])  
# @token_required
# def add_inventory_item(current_user):
#     data = request.get_json()
#     try:
#         new_item = Inventory(**data)
#         db.session.add(new_item)  # ✅ Add item to session
#         db.session.commit()  # ✅ Commit to DB
#         return jsonify(new_item.to_dict()), 201
#     except Exception as e:
#         db.session.rollback()  # ✅ Rollback on failure
#         return jsonify({"message": str(e)}), 400

# # ✅ Update an inventory item
# @inventory_bp.route('/<int:id>', methods=['PUT'])
# @token_required
# def update_inventory(current_user, id):
#     data = request.get_json()
#     item = Inventory.query.get(id)
#     if not item:
#         return jsonify({"message": "Item not found"}), 404
#     try:
#         for key, value in data.items():
#             setattr(item, key, value)
#         db.session.commit()  # ✅ Commit changes
#         return jsonify(item.to_dict()), 200
#     except Exception as e:
#         db.session.rollback()  # ✅ Rollback on error
#         return jsonify({"message": str(e)}), 400

# # ✅ Delete an inventory item
# @inventory_bp.route('/<int:id>', methods=['DELETE'])
# @token_required
# def delete_inventory(current_user, id):
#     item = Inventory.query.get(id)
#     if not item:
#         return jsonify({"message": "Item not found"}), 404
#     try:
#         db.session.delete(item)  # ✅ Delete item
#         db.session.commit()  # ✅ Commit changes
#         return jsonify({"message": "Item deleted successfully"}), 200
#     except Exception as e:
#         db.session.rollback()  # ✅ Rollback on error
#         return jsonify({"message": str(e)}), 400


# @inventory_bp.route('/update_stock', methods=['PUT'])
# @token_required
# def update_inventory(current_user):
#     """
#     Deducts stock when a drug is prescribed.
#     """
#     data = request.get_json()
    
#     drug_id = data.get("drug_id")
#     quantity = data.get("quantity")

#     if not drug_id or quantity is None:
#         return jsonify({"message": "Drug ID and quantity are required"}), 400

#     drug = Inventory.query.get(drug_id)
#     if not drug:
#         return jsonify({"message": "Drug not found"}), 404

#     if drug.stock < quantity:
#         return jsonify({"message": f"Insufficient stock for {drug.name}"}), 400

#     try:
#         drug.stock -= quantity
#         db.session.commit()
#         return jsonify({"message": "Inventory updated", "new_stock": drug.stock}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": str(e)}), 500

from flask import Blueprint, request, jsonify
from flask_cors import CORS  
from models import db, Inventory
from datetime import datetime
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
# @inventory_bp.route('/add', methods=['POST'])  
# @token_required
# def add_inventory_item(current_user):
#     data = request.get_json()
#     try:
#         new_item = Inventory(**data)
#         db.session.add(new_item)
#         db.session.commit()
#         return jsonify(new_item.to_dict()), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": str(e)}), 400

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


# ✅ Update an inventory item
@inventory_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_inventory_item(current_user, id):
    data = request.get_json()
    item = Inventory.query.get(id)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    try:
        for key, value in data.items():
            setattr(item, key, value)
        db.session.commit()
        return jsonify(item.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

# ✅ Delete an inventory item
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

# ✅ Deduct stock when an item is prescribed
@inventory_bp.route('/update_stock', methods=['PUT'])
@token_required
def update_inventory_stock(current_user):
    data = request.get_json()
    
    drug_id = data.get("drug_id")
    quantity = data.get("quantity")

    if not drug_id or quantity is None:
        return jsonify({"message": "Drug ID and quantity are required"}), 400

    drug = Inventory.query.get(drug_id)
    if not drug:
        return jsonify({"message": "Drug not found"}), 404

    if drug.stock < quantity:
        return jsonify({"message": f"Insufficient stock for {drug.name}"}), 400

    try:
        drug.stock -= quantity
        db.session.commit()
        return jsonify({"message": "Inventory updated", "new_stock": drug.stock}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
