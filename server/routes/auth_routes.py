from flask import Blueprint, request, jsonify
from models import db, User
from utils.jwt_utils import generate_jwt
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

auth_bp = Blueprint('auth', __name__)

# Signup Route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'staff')  # Default role is "staff"

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    # Check if the user already exists
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password_hash=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

# Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    # Find the user
    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Generate JWT token
    # token = generate_jwt({"user_id": user.id, "role": user.role})
    token = generate_jwt(user.id, user.role)


    return jsonify({"message": "Login successful", "token": token, "role": user.role}), 200

# Logout Route (Optional - Just for clearing client-side data)
@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logout successful"}), 200