import jwt
from datetime import datetime, timedelta
from config import Config

def generate_jwt(user_id, role):
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")
    return token

def decode_jwt(token):
    return jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])