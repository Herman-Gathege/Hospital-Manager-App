from functools import wraps
from flask import request, jsonify
from utils.jwt_utils import decode_jwt
from models import User  

PUBLIC_ROUTES = ["/auth/login", "/auth/signup"]

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
            user_data = decode_jwt(token)
            user = User.query.get(user_data["user_id"])

            if not user:
                return jsonify({"message": "User not found"}), 404

            # Attach user to request
            request.user = user
        except Exception:
            return jsonify({"message": "Token is invalid"}), 401

        return f(user, *args, **kwargs)

    return decorated

