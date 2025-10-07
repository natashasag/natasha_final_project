from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps
import os
import random

# ===================================
# FLASK APP CONFIG (CORS FIXED ✅)
# ===================================
app = Flask(__name__)

# ✅ Allow your frontend origin explicitly
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080"]}}, supports_credentials=True)

@app.after_request
def after_request(response):
    # Force CORS headers even on errors
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE")
    return response

# ===================================
# DATABASE CONFIG
# ===================================
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "natasha06")
app.config["MONGO_URI"] = os.environ.get(
    "MONGO_URI",
    "mongodb+srv://thesearchifi:dKvX774tb1FzVoWj@cluster0.rjir4md.mongodb.net/natasha"
)

mongo = PyMongo(app)

# ✅ Select your specific database explicitly
db = mongo.cx["natasha"]

print("✅ Flask server started")
print("✅ Connected to MongoDB:", mongo.cx.list_database_names())


# ============================================
# JWT DECORATOR
# ============================================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token missing!'}), 401

        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = db.users.find_one({'_id': data['user_id']})
        except Exception as e:
            return jsonify({'message': 'Invalid token!', 'error': str(e)}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# ============================================
# REGISTER
# ============================================
@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight passed'}), 200

    data = request.get_json()

    if db.users.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists!'}), 400

    hashed_password = generate_password_hash(data['password'])
    user_data = {
        'name': data['name'],
        'email': data['email'],
        'password_hash': hashed_password,
        'created_at': datetime.utcnow()
    }

    result = db.users.insert_one(user_data)
    token = jwt.encode({
        'user_id': str(result.inserted_id),
        'exp': datetime.utcnow() + timedelta(days=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'message': 'User created successfully!',
        'token': token,
        'user': {
            'id': str(result.inserted_id),
            'name': data['name'],
            'email': data['email']
        }
    }), 201

# ============================================
# LOGIN
# ============================================
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight passed'}), 200

    data = request.get_json()
    user = db.users.find_one({'email': data['email']})

    if not user or not check_password_hash(user['password_hash'], data['password']):
        return jsonify({'message': 'Invalid credentials!'}), 401

    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.utcnow() + timedelta(days=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email']
        }
    })

# ============================================
# CALCULATE FOOTPRINT
# ============================================
@app.route('/api/calculate', methods=['POST', 'OPTIONS'])
@token_required
def calculate_footprint(current_user):
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight passed'}), 200

    data = request.get_json()

    EMISSION_FACTORS = {
        'transport': {'car': 0.21, 'bus': 0.08, 'train': 0.04, 'bicycle': 0, 'walking': 0, 'motorcycle': 0.15},
        'electricity': 0.5,
        'diet': {'meat_heavy': 3.3, 'meat_moderate': 2.5, 'vegetarian': 1.7, 'vegan': 1.5},
        'housing': {'small': 1.2, 'medium': 1.5, 'large': 2.0, 'very_large': 2.5},
        'flights': 0.25,
        'tree_offset': 22
    }

    transport = data['weeklyDistance'] * 52 * EMISSION_FACTORS['transport'].get(data['transportMode'], 0.21)
    electricity = data['electricityBill'] * 12 * EMISSION_FACTORS['electricity']
    diet = EMISSION_FACTORS['diet'].get(data['dietType'], 2.5) * 365
    housing = electricity * EMISSION_FACTORS['housing'].get(data['homeSize'], 1.5)
    flights = data['flightsPerYear'] * 1000 * EMISSION_FACTORS['flights']
    offset = -(data['treesPlanted'] * EMISSION_FACTORS['tree_offset'])
    recycling = -200 if data['recyclingHabits'] == 'always' else (-100 if data['recyclingHabits'] == 'sometimes' else 0)

    total = max(0, transport + electricity + diet + housing + flights + offset + recycling)
    category = 'good' if total <= 4000 else 'bad'

    tips = {
        'good': [
            "Keep up the great work!",
            "You're doing amazing!",
            "Excellent carbon footprint!"
        ],
        'bad': [
            "Use public transport more often.",
            "Reduce meat consumption.",
            "Plant more trees to offset emissions."
        ]
    }

    tip = random.choice(tips[category])

    db.footprint_calculations.insert_one({
        'user_id': str(current_user['_id']),
        'transport_mode': data['transportMode'],
        'weekly_distance': data['weeklyDistance'],
        'electricity_bill': data['electricityBill'],
        'diet_type': data['dietType'],
        'home_size': data['homeSize'],
        'flights_per_year': data['flightsPerYear'],
        'recycling_habits': data['recyclingHabits'],
        'trees_planted': data['treesPlanted'],
        'total_score': total,
        'category': category,
        'tip': tip,
        'created_at': datetime.utcnow()
    })

    return jsonify({
        'totalScore': total,
        'category': category,
        'tip': tip
    })

# ============================================
# HISTORY
# ============================================
@app.route('/api/history', methods=['GET'])
@token_required
def history(current_user):
    calculations = list(db.footprint_calculations.find({'user_id': str(current_user['_id'])}).sort('created_at', -1))
    return jsonify([{
        'id': str(c['_id']),
        'date': c['created_at'].isoformat(),
        'totalScore': c['total_score'],
        'category': c['category'],
        'tip': c['tip']
    } for c in calculations])

# ============================================
# CONTACT
# ============================================
@app.route('/api/contact', methods=['POST', 'OPTIONS'])
def contact():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight passed'}), 200

    data = request.get_json()
    db.contacts.insert_one({
        'name': data['name'],
        'email': data['email'],
        'subject': data['subject'],
        'message': data['message'],
        'created_at': datetime.utcnow()
    })
    return jsonify({'message': 'Contact form submitted successfully!'})


# ============================================
# MAIN
# ============================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)
