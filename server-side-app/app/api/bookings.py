from flask import Blueprint, jsonify, redirect, render_template, url_for, flash, request
from app import app
from flask_cors import CORS

booking_api = Blueprint(
    'booking_api', 'booking_api', url_prefix='/api/booking')

CORS(app)

@booking_api.route('/')
def get_all_bookings():
    """
    Returns list of all bookings.
    """
    return "bookings"

