import os
from flask import Flask, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from rp4app.api.relay import relay_api, auth_api



def create_app():

    APP_DIR = os.path.abspath(os.path.dirname(__file__))
    STATIC_FOLDER = os.path.join(APP_DIR, 'build/static')
    TEMPLATE_FOLDER = os.path.join(APP_DIR, 'build')

    app = Flask(__name__, static_folder=STATIC_FOLDER,
                template_folder=TEMPLATE_FOLDER,
                )
    CORS(app)

    app.register_blueprint(relay_api)
    app.register_blueprint(auth_api)


    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        return render_template('index.html')
    
    jwt = JWTManager(app)

    return app