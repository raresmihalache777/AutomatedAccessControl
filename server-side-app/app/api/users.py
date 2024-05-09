from flask import Blueprint, jsonify, redirect, render_template, url_for, flash, request
from app import app
from flask_cors import CORS

user_api = Blueprint(
    'user_api', 'user_api', url_prefix='/api/user')

CORS(app)

@user_api.route('/')
def get_all_users():
    """
    Returns list of all bookings.
    """
    return "users"

