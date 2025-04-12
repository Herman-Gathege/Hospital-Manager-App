# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_cors import CORS
# from config import Config
# from models import db
# # from utils.auth_middleware import token_required
# from routes import register_routes

# app = Flask(__name__)
# app.config.from_object(Config)

# # Initialize extensions
# db.init_app(app)
# migrate = Migrate(app, db)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# # Middleware for authentication
# # app.before_request(token_required)

# # Register routes
# register_routes(app)

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db
import os

from routes import register_routes

app = Flask(__name__, static_folder="static")  # React build/ copied here
app.config.from_object(Config)

# Extensions
db.init_app(app)
migrate = Migrate(app, db)


CORS(app, resources={r"/*": {"origins": [
    "http://localhost:3000",
    "https://hospital-manager-app.onrender.com"
]}})



# API Routes
register_routes(app)

# ✅ Serve React build for unmatched routes
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
