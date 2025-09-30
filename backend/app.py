from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///footprints.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with calculations
    calculations = db.relationship('FootprintCalculation', backref='user', lazy=True)

class FootprintCalculation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    transport_mode = db.Column(db.String(50), nullable=False)
    weekly_distance = db.Column(db.Float, nullable=False)
    electricity_bill = db.Column(db.Float, nullable=False)
    diet_type = db.Column(db.String(50), nullable=False)
    home_size = db.Column(db.String(50), nullable=False)
    flights_per_year = db.Column(db.Integer, nullable=False)
    recycling_habits = db.Column(db.String(50), nullable=False)
    trees_planted = db.Column(db.Integer, nullable=False)
    total_score = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(20), nullable=False)
    tip = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# JWT Token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists!'}), 400
    
    # Create new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        name=data['name'],
        email=data['email'],
        password_hash=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generate token
    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.utcnow().timestamp() + 86400  # 24 hours
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'User created successfully!',
        'token': token,
        'user': {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow().timestamp() + 86400  # 24 hours
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            }
        })
    
    return jsonify({'message': 'Invalid credentials!'}), 401

@app.route('/api/calculate', methods=['POST'])
@token_required
def calculate_footprint(current_user):
    data = request.get_json()
    
    # Carbon calculation logic (simplified)
    EMISSION_FACTORS = {
        'transport': {'car': 0.21, 'bus': 0.08, 'train': 0.04, 'bicycle': 0, 'walking': 0, 'motorcycle': 0.15},
        'electricity': 0.5,
        'diet': {'meat_heavy': 3.3, 'meat_moderate': 2.5, 'vegetarian': 1.7, 'vegan': 1.5},
        'housing': {'small': 1.2, 'medium': 1.5, 'large': 2.0, 'very_large': 2.5},
        'flights': 0.25,
        'tree_offset': 22
    }
    
    # Calculate emissions
    transport_emissions = data['weeklyDistance'] * 52 * EMISSION_FACTORS['transport'].get(data['transportMode'], 0.21)
    electricity_emissions = data['electricityBill'] * 12 * EMISSION_FACTORS['electricity']
    diet_emissions = EMISSION_FACTORS['diet'].get(data['dietType'], 2.5) * 365
    housing_emissions = electricity_emissions * EMISSION_FACTORS['housing'].get(data['homeSize'], 1.5)
    flight_emissions = data['flightsPerYear'] * 1000 * EMISSION_FACTORS['flights']
    tree_offset = -(data['treesPlanted'] * EMISSION_FACTORS['tree_offset'])
    
    recycling_bonus = -200 if data['recyclingHabits'] == 'always' else (-100 if data['recyclingHabits'] == 'sometimes' else 0)
    
    total_score = transport_emissions + electricity_emissions + diet_emissions + housing_emissions + flight_emissions + tree_offset + recycling_bonus
    total_score = max(0, total_score)
    
    category = 'good' if total_score <= 4000 else 'bad'
    
    tips = {
        'good': [
            "Keep up the great work! Consider sharing your eco-friendly habits with friends and family.",
            "You're doing amazing! Try switching to renewable energy if you haven't already.",
            "Excellent carbon footprint! Consider offsetting your remaining emissions through verified carbon credits."
        ],
        'bad': [
            "Consider using public transport or cycling more often to reduce transportation emissions.",
            "Try reducing meat consumption and eating more plant-based meals throughout the week.",
            "Plant more trees or support reforestation projects to offset your carbon emissions."
        ]
    }
    
    import random
    tip = random.choice(tips[category])
    
    # Save calculation
    calculation = FootprintCalculation(
        user_id=current_user.id,
        transport_mode=data['transportMode'],
        weekly_distance=data['weeklyDistance'],
        electricity_bill=data['electricityBill'],
        diet_type=data['dietType'],
        home_size=data['homeSize'],
        flights_per_year=data['flightsPerYear'],
        recycling_habits=data['recyclingHabits'],
        trees_planted=data['treesPlanted'],
        total_score=total_score,
        category=category,
        tip=tip
    )
    
    db.session.add(calculation)
    db.session.commit()
    
    return jsonify({
        'totalScore': total_score,
        'category': category,
        'tip': tip,
        'breakdown': {
            'transport': transport_emissions,
            'electricity': electricity_emissions,
            'diet': diet_emissions,
            'housing': housing_emissions,
            'flights': flight_emissions,
            'offset': tree_offset + recycling_bonus
        }
    })

@app.route('/api/history', methods=['GET'])
@token_required
def get_history(current_user):
    calculations = FootprintCalculation.query.filter_by(user_id=current_user.id).order_by(FootprintCalculation.created_at.desc()).all()
    
    history = []
    for calc in calculations:
        history.append({
            'id': calc.id,
            'date': calc.created_at.isoformat(),
            'totalScore': calc.total_score,
            'category': calc.category,
            'tip': calc.tip
        })
    
    return jsonify(history)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    
    contact = Contact(
        name=data['name'],
        email=data['email'],
        subject=data['subject'],
        message=data['message']
    )
    
    db.session.add(contact)
    db.session.commit()
    
    return jsonify({'message': 'Contact form submitted successfully!'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)