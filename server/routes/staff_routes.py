from flask import Blueprint, request, jsonify
from models import Staff
from utils.auth_middleware import token_required

staff_bp = Blueprint('staff', __name__)  # Updated to match your __init__.py

@staff_bp.route('/', methods=['GET'])
@token_required
def get_all_staff(current_user):
    staff = Staff.query.all()
    return jsonify([member.to_dict() for member in staff]), 200

@staff_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_staff(current_user, id):
    staff = Staff.query.get(id)
    if not staff:
        return jsonify({"message": "Staff not found"}), 404
    return jsonify(staff.to_dict()), 200

@staff_bp.route('/', methods=['POST'])
@token_required
def create_staff(current_user):
    data = request.get_json()
    try:
        new_staff = Staff(**data)
        new_staff.save()
        return jsonify(new_staff.to_dict()), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@staff_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_staff(current_user, id):
    data = request.get_json()
    staff = Staff.query.get(id)
    if not staff:
        return jsonify({"message": "Staff not found"}), 404
    try:
        for key, value in data.items():
            setattr(staff, key, value)
        staff.save()
        return jsonify(staff.to_dict()), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@staff_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_staff(current_user, id):
    staff = Staff.query.get(id)
    if not staff:
        return jsonify({"message": "Staff not found"}), 404
    try:
        staff.delete()
        return jsonify({"message": "Staff deleted"}), 204
    except Exception as e:
        return jsonify({"message": str(e)}), 400
