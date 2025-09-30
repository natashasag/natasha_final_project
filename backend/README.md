# Footprints Backend

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the application:
```bash
python app.py
```

The backend will run on http://localhost:5000

## API Endpoints

- POST `/api/register` - User registration
- POST `/api/login` - User login
- POST `/api/calculate` - Calculate carbon footprint (requires auth)
- GET `/api/history` - Get user's calculation history (requires auth)
- POST `/api/contact` - Submit contact form

## Database

SQLite database will be created automatically when you run the app.