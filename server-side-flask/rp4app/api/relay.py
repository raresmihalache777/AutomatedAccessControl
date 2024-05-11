from flask import Blueprint, request, jsonify

from flask_cors import CORS
from rp4app.api.utils import expect
from datetime import datetime

relay_api = Blueprint(
    'relay_api', 'relay_api', url_prefix='/api/relay')

CORS(relay_api)

@relay_api.route('/', methods=['GET'])
def api_root_response():
    return "relay root endpoint"