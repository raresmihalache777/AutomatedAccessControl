from rp4app.factory import create_app
import os
import configparser


config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".ini")))


if __name__ == "__main__":
    app = create_app()
    app.config['DEBUG'] = True
    app.config['MONGO_URI'] = config['PROD']['DB_URI']
    app.config['PORT'] = config['PROD']['PORT']
    app.config['SSL_CERT'] = config['PROD']['SSL_CERT']
    app.config['PRIVATE_KEY'] = config['PROD']['PRIVATE_KEY']
    app.config["JWT_SECRET_KEY"] = config['PROD']['PRIVATE_KEY']
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.run(port=app.config['PORT'], ssl_context=(app.config['SSL_CERT'], app.config['PRIVATE_KEY']))

