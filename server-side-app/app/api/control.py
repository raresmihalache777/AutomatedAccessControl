from flask import Blueprint, jsonify, redirect, render_template, url_for, flash, request
from app import app
from flask_cors import CORS

control_api = Blueprint(
    'control_api', 'control_api', url_prefix='/api/control')

CORS(app)

@control_api.route('/')
def get_relay_status():
    """
    Returns list of all bookings.
    """
    return "status"