from flask import Blueprint, request, jsonify
from models import Staff, db  # Ensure db is imported
from utils.auth_middleware import token_required

staff_bp = Blueprint('staff', __name__)

@staff_bp.route('/', methods=['GET'])
@token_required
def get_all_staff(current_user):
    """Fetch all staff members."""
    staff = Staff.query.all()
    return jsonify([member.to_dict() for member in staff]), 200

@staff_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_staff(current_user, id):
    """Fetch a specific staff member by ID."""
    staff = Staff.query.get(id)
    if not staff:
        return jsonify({"message": "Staff not found"}), 404
    return jsonify(staff.to_dict()), 200

@staff_bp.route('/', methods=['POST'])
@token_required
def create_staff(current_user):
    """Create a new staff member."""
    data = request.get_json()
    try:
        new_staff = Staff(**data)
        db.session.add(new_staff)  # Add to session
        db.session.commit()  # Commit to DB
        return jsonify(new_staff.to_dict()), 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"message": f"Error creating staff: {str(e)}"}), 400

@staff_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_staff(current_user, id):
    """Update an existing staff member."""
    staff = Staff.query.get(id)
    if not staff:
        return jsonify({"message": "Staff not found"}), 404

    data = request.get_json()
    try:
        for key, value in data.items():
            setattr(staff, key, value)
        db.session.commit()  # Commit changes
        return jsonify(staff.to_dict()), 200
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"message": f"Error updating staff: {str(e)}"}), 400

@staff_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_staff(current_user, id):
    """Delete a staff member."""
    staff = Staff.query.get(id)
    if not staff:
        return jsonify({"message": "Staff not found"}), 404
    try:
        db.session.delete(staff)  # Delete staff
        db.session.commit()  # Commit changes
        return jsonify({"message": "Staff deleted"}), 200
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"message": f"Error deleting staff: {str(e)}"}), 400
