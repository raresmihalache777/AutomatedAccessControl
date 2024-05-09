from flask import jsonify, redirect, render_template, url_for, flash, request
from app import app
import os


@app.route('/')
def index():
    return "ceva"