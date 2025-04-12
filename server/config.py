import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET = os.getenv("JWT_SECRET", "jwtsecretkey")
    CORS_HEADERS = "Content-Type"
    # JWT_ACCESS_TOKEN_EXPIRES = 900  # 15 minutes
    # JWT_REFRESH_TOKEN_EXPIRES = 86400  # 24 hours