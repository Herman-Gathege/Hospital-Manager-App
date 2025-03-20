# from functools import wraps
# from flask import request, jsonify
# from utils.jwt_utils import decode_jwt

# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         auth_header = request.headers.get("Authorization")
#         if not auth_header or not auth_header.startswith("Bearer "):
#             return jsonify({"message": "Token is missing or invalid"}), 401

#         token = auth_header.split(" ")[1]
#         try:
#             user = decode_jwt(token)
#             request.user = user
#         except Exception as e:
#             return jsonify({"message": "Token is invalid"}), 401

#         return f(*args, **kwargs)

#     return decorated

from functools import wraps
from flask import request, jsonify
from utils.jwt_utils import decode_jwt

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
            user = decode_jwt(token)
            request.user = user
        except Exception as e:
            return jsonify({"message": "Token is invalid"}), 401

        return f(user, *args, **kwargs)

    return decorated
