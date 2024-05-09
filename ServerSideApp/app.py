from flask import Flask, jsonify, request
import requests
from config import config

app = Flask(__name__)

@app.route('/unlock', methods=['GET'])
def handle_request():
    print("Cineva vrea sa deschida!")
    
    response = requests.get(config.CLIENT_URL + '/api/unlockResponse')
    print(response)

    return "Cererea a fost procesata cu succes. Trimit ${response}"
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config.PORT, debug=config.DEBUG)  # Run the server on all network interfaces on port 8080
