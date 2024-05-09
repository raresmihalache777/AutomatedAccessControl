from flask import Flask
from config import config

app = Flask(__name__)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config.PORT, debug=config.DEBUG)  # Run the server on all network interfaces on port 8080
