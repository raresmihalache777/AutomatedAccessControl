from flask import Flask, jsonify, request
from config import config
from run import app
import requests

@app.route('/unlock', methods=['GET'])
def handle_request():
    print("Cineva vrea sa deschida!")
    
    response = requests.get(config.CLIENT_URL + '/api/unlockResponse')
    print(response)

    return "Cererea a fost procesata cu succes. Trimit ${response}"

@app.route('/', methods=['GET'])
def handle_index():
    return "index"