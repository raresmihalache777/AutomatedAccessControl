from app import app
from config import config

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config.PORT, debug=config.DEBUG)  # Run the server on all network interfaces on port 8080
