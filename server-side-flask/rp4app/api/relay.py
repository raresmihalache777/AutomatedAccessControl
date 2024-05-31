from flask import Blueprint, request, jsonify

from flask_cors import CORS
from rp4app.api.utils import expect
from datetime import datetime
from relay import Sr201
import configparser
import os

config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))

relay_api = Blueprint(
    'relay_api', 'relay_api', url_prefix='/api/relay')

CORS(relay_api)

#Configure relay object for relay controll
try:
    relay = Sr201(config['PROD']['REALY_IP'])
except:
    print('Error while connectiong to relay!')

@relay_api.route('/', methods=['GET'])
def api_relay_status():
    response = relay.do_status('status')
    return response

@relay_api.route('/open', methods=['POST'])
def api_relay_open():
    relay_number = request.args.get('relay_number')
    response = relay.do_open(f'open:{relay_number}')
    return response

@relay_api.route('/close', methods=['POST'])
def api_relay_close():
    print(request)
    relay_number = request.args.get('relay_number')
    relay_delay = request.args.get('relay_delay')
    if relay_delay:
        response = relay.do_close(f'close:{relay_number}:{relay_delay}')
    else:
        response = relay.do_close(f'close:{relay_number}')
    return response