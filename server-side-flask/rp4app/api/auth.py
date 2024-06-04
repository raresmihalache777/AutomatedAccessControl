from flask import Blueprint, request, jsonify

from flask_cors import CORS
from rp4app.api.utils import expect
from datetime import datetime
from relay import Sr201
import configparser
import os
import time


config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))

auth_api = Blueprint(
    'auth_api', 'auth_api', url_prefix='/api/auth')

CORS(auth_api)

@auth_api.route('/', methods=['GET'])
def api_relay_status():
    try:
        return 'This is the auth endpoint!'
    except Exception as e:
        print('Error:', e)

@auth_api.route('/get-token', methods=['GET'])
def api_relay_status():
    try:
        print('ceva')
        return None
    except Exception as e:
        print('Error:', e)