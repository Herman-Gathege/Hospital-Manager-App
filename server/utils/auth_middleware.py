from functools import wraps
from flask import request, jsonify
from utils.jwt_utils import decode_jwt
from models import User  # Import the User model

# Define routes that don't require authentication
PUBLIC_ROUTES = ["/login", "/signup"]

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Skip authentication for public routes
        if request.path in PUBLIC_ROUTES:
            return f(*args, **kwargs)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Token is missing or invalid"}), 401

        token = auth_header.split(" ")[1]
        try:
            user_data = decode_jwt(token)  # This returns a dictionary
            user = User.query.get(user_data["user_id"])  # Get the actual User object from the database

            if not user:
                return jsonify({"message": "User not found"}), 404
            
            request.user = user
        except Exception as e:
            return jsonify({"message": "Token is invalid"}), 401

        return f(user, *args, **kwargs)

    return decorated
