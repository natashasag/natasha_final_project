# Footprints - Carbon Footprint Calculator

A full-stack web application for calculating and tracking personal carbon footprints.

## 📁 Project Structure

This project has **two main folders**:

### 🎨 **Frontend** (Root Directory)
All frontend code is at the project root:
```
├── src/              # React application source code
├── public/           # Static assets
├── index.html        # Main HTML entry point
├── vite.config.ts    # Build configuration
├── tailwind.config.ts # Styling configuration
└── package.json      # Frontend dependencies
```

### 🔧 **Backend** (`backend/` folder)
All backend code is in the `backend/` directory:
```
backend/
├── app.py            # Flask API server
├── requirements.txt  # Python dependencies
├── .env.example      # Environment variables template
└── README.md         # Backend documentation
```

**Note:** The frontend remains at the root due to build system requirements (Vite + React standard structure).

---

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

### Frontend Setup
```bash
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000

## Features

- User authentication (register/login)
- Carbon footprint calculation
- History tracking
- Dashboard with statistics
- Contact form
- Responsive design

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Vite

**Backend:**
- Flask
- SQLAlchemy
- SQLite
- JWT Authentication
- Flask-CORS

## 📧 Contact

- **Email**: gundayenatasha12@gmail.com
- **Phone**: xxxxxxxxxx
- **Location**: Mumbai, India
