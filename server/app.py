from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db
# from utils.auth_middleware import token_required
from routes import register_routes

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

# Middleware for authentication
# app.before_request(token_required)

# Register routes
register_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
