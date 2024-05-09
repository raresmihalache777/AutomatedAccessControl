from flask import Blueprint, jsonify, redirect, render_template, url_for, flash, request
from app import app
from flask_cors import CORS
from db import db_query_get_all_users

CORS(app)


@app.route('/bookings')
def get_all_bookings():
    """
    Returns list of all bookings.
    """
    return "bookings"

@app.route('/users')
def get_all_users():
    """
    Returns list of all users.
    """
    return db_query_get_all_users()
   
@app.route('/')
def index():
    return "index"
