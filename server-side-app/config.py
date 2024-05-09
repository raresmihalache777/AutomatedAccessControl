# config.py
class Config:
    DEBUG = True
    CLIENT_URL = 'http://192.168.1.132'
    DATABASE_URI = 'sqlite:///my_database.db'
    SECRET_KEY = 'your_secret_key_here'
    PORT = 5001

config = Config()