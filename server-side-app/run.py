import configparser
import os
from app import app

config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))

if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.config['MONGO_URI'] = config['PROD']['DB_URI']
    app.run(host='0.0.0.0', port=config['PROD']['PORT'])
