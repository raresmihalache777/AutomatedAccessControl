from flask import Blueprint, json, request, jsonify

from flask_cors import CORS
from rp4app.api.utils import expect
from datetime import datetime
from relay import Sr201
import configparser
import os
import time
from flask_jwt_extended import JWTManager, create_access_token, jwt_required


config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))

relay_api = Blueprint(
    'relay_api', 'relay_api', url_prefix='/api/relay')

auth_api = Blueprint(
    'auth_api', 'auth_api', url_prefix='/api/auth')


CORS(relay_api)
CORS(auth_api)

#Configure relay object for relay controll
for i in range(30):
    try:
        relay = Sr201(config['PROD']['REALY_IP'])
        print('Connected to the relay!')
        time.sleep(2.5)
        break
    except:
        print('Error while connectiong to relay!')

@relay_api.route('/', methods=['GET'])
@jwt_required()
def api_relay_status():
    try:
        response = relay.do_status('status')
        return response
    except Exception as e:
        print('Error:', e)
        return False
    finally:
        relay.close()

@relay_api.route('/open', methods=['POST'])
@jwt_required()
def api_relay_open():
    try:
        print(request)
        relay_number = request.args.get('relay_number')
        response = relay.do_open(f'open:{relay_number}')
        return response
    except Exception as e:
        print('Error:', e)
    finally:
        relay.close()

@relay_api.route('/close', methods=['POST'])
@jwt_required()
def api_relay_close():
    try:
        print(request)
        relay_number = request.args.get('relay_number')
        relay_delay = request.args.get('relay_delay')
        if relay_delay:
            response = relay.do_close(f'close:{relay_number}:{relay_delay}')
        else:
            response = relay.do_close(f'close:{relay_number}')
        return response
    except Exception as e:
        print('Error:', e)
    finally:
        relay.close()

@auth_api.route('/get-token', methods=['GET'])
def api_relay_status():
    try:
        body = json.loads(request.data)
        [client_username, client_password] = [body['clientUser'], body['clientPass']]
        if client_username == config['PROD']['AUTH_USER'] and client_password == config['PROD']['AUTH_PASS']:
            access_token = create_access_token(identity=client_username)
            return jsonify({'message': 'Login Success', 'access_token': access_token})
        else:
            return jsonify({'message': 'Login Failed', 'error': e}), 401
    except Exception as e:
        print('Error:', e)
        return jsonify({'message': 'Login Failed', 'error': e}), 401

