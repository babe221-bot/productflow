# ProducFlow - Manufacturing Management System

> **Real-time Manufacturing Operations Dashboard** with Equipment Monitoring, Predictive Maintenance, and Production Analytics

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org)

---

## 🎯 Overview

ProducFlow is a comprehensive manufacturing management platform providing real-time equipment monitoring, AI-simulated predictive maintenance alerts, production analytics, and user management. Built with modern **FastAPI backend** and **React frontend**, it delivers manufacturing insights through an intuitive Material-UI dashboard.

### ✨ Key Features

🏭 **Equipment Monitoring**
- Real-time status tracking (Operational, Warning, Critical, Maintenance)
- Health score monitoring with color-coded indicators  
- Sensor data visualization (Temperature, Pressure, Vibration, Speed)
- Equipment filtering and search capabilities

🔧 **Maintenance Management**
- Priority-based maintenance alerts (Critical, High, Medium, Low)
- Maintenance history logging and tracking
- Simulated predictive maintenance with confidence scores
- Technician assignment and cost tracking

📊 **Production Analytics**
- Real-time efficiency metrics and KPI dashboards
- Output vs defect rate analysis
- Downtime tracking by equipment type
- Interactive Chart.js visualizations

👥 **User Management**
- Role-based access control (Admin, Manager, Technician, Operator)
- Department-based organization
- JWT-based authentication with secure password hashing

---

## 🏗️ Architecture

### Technology Stack (Actual Implementation)

#### Backend - **FastAPI + SQLAlchemy**
- **FastAPI** ≥0.100.0 - Modern async web framework
- **SQLAlchemy 2.0** - Async ORM with declarative models
- **PostgreSQL/SQLite** - Production/development databases
- **Pydantic v2** - Request/response validation
- **JWT + bcrypt** - Secure authentication
- **uvicorn** - High-performance ASGI server

#### Frontend - **React 18 + Material-UI**
- **React 18.2.0** - Modern functional components with hooks
- **JavaScript** - Current implementation (TypeScript migration planned)
- **Material-UI v5** - Professional component library
- **Chart.js + react-chartjs-2** - Interactive data visualization
- **Axios** - HTTP client with JWT interceptors
- **React Router v6** - Client-side routing

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for repository cloning

### 1. Automated Setup (Recommended)
```bash
# Clone repository
git clone https://github.com/babe221-bot/productflow.git
cd productflow

# One-command startup (starts both backend and frontend)
python start_producflow.py
```

### 2. Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database with sample data
python init_db.py

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server (proxies to backend:8000)
npm start
```

### 3. Access Applications
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc

---

## 🔐 Demo Access

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@producflow.com | admin123 | Full system access |
| **Manager** | manager@producflow.com | manager123 | Production oversight |
| **Technician** | tech@producflow.com | tech123 | Maintenance focus |

---

## 📁 Repository Structure

```
productflow/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── auth.py            # JWT authentication & authorization
│   │   ├── crud.py            # Database operations & business logic
│   │   ├── database.py        # Async SQLAlchemy configuration
│   │   ├── models.py          # Database models (User, Equipment, etc.)
│   │   └── schemas.py         # Pydantic request/response schemas
│   ├── main.py                # FastAPI app with route definitions
│   ├── init_db.py             # Database initialization & sample data
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment configuration
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Layout.js      # Main app layout with navigation
│   │   │   ├── Login.js       # Authentication form
│   │   │   └── ...
│   │   ├── contexts/          # React context providers
│   │   │   └── AuthContext.js # Authentication state management
│   │   ├── pages/             # Route components
│   │   │   ├── Dashboard.js   # Real-time KPI dashboard
│   │   │   ├── Equipment.js   # Equipment list with filtering
│   │   │   ├── Maintenance.js # Maintenance alerts & logs
│   │   │   ├── Analytics.js   # Production analytics & charts
│   │   │   └── ...
│   │   ├── App.js             # Main routing component
│   │   └── index.js           # React entry point
│   ├── package.json           # Node.js dependencies
│   └── public/                # Static assets
├── DEMO.md                    # Feature walkthrough guide
├── DEPLOYMENT.md              # Production deployment guide
├── STATUS.md                  # Development status matrix
└── start_producflow.py        # Automated startup script
```

---

## 🔌 API Reference

### Authentication
```http
POST /token                    # Login with email/password
GET  /users/me                 # Get current user profile
```

### Equipment Management
```http
GET    /equipment              # List equipment (with filtering)
GET    /equipment/{id}         # Get equipment details
POST   /equipment              # Create new equipment
GET    /equipment/{id}/sensors # Get sensor data for equipment
POST   /equipment/{id}/sensors # Add sensor reading
```

### Maintenance
```http
GET    /maintenance            # Get active maintenance alerts
POST   /maintenance            # Create maintenance alert
GET    /maintenance/logs       # Get maintenance history
POST   /maintenance/logs       # Create maintenance log
PATCH  /maintenance/logs/{id}/status  # Update maintenance status
```

### Production Analytics
```http
GET /dashboard/summary         # Dashboard overview metrics
GET /production/metrics        # Production efficiency data
GET /production/records        # Production records with filtering
```

---

## 🛠️ Development

### Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=sqlite+aiosqlite:///./producflow.db

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:3000"]
```

#### Frontend (.env)
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

### Testing

#### Backend Testing
```bash
cd backend
pip install -r requirements-dev.txt
pytest -v
```

#### Frontend Testing
```bash
cd frontend
npm test
npm test -- --coverage
```

### Building for Production

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm run build
# Serve build/ directory with nginx or static server
```

---

## 🐳 Docker Deployment

### Development with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down
```

### Production Docker Build
```bash
# Backend
cd backend
docker build -t producflow-backend .
docker run -p 8000:8000 producflow-backend

# Frontend
cd frontend
npm run build
# Serve with nginx (see DEPLOYMENT.md)
```

---

## 📈 Sample Data

ProducFlow includes comprehensive sample data for immediate testing:

- **5 Manufacturing Equipment** with different statuses and health scores
- **Real-time Sensor Data** (temperature, pressure, vibration, speed)
- **Maintenance Alerts** with priority levels and confidence scores
- **Production Records** with efficiency tracking
- **User Accounts** representing different roles

### Equipment Included
1. **Injection Molding Machine #1** (Operational, 95.2% health)
2. **CNC Milling Machine #2** (Warning, 78.5% health)
3. **Conveyor System #1** (Operational, 88.9% health)
4. **Robotic Arm #3** (Critical, 45.3% health)
5. **Quality Control Scanner** (Operational, 92.7% health)

---

## 🔒 Security

- **JWT Authentication** with secure token management
- **bcrypt Password Hashing** for user credentials
- **CORS Configuration** for cross-origin requests
- **Input Validation** via Pydantic schemas
- **SQL Injection Protection** via SQLAlchemy ORM
- **Role-Based Access Control** (UI implemented, backend enforcement planned)

---

## 🚧 Roadmap & Known Issues

### Current Limitations
- Frontend uses **JavaScript** (not TypeScript as initially planned)
- Mixed **Django/React files** in frontend directory (cleanup needed)
- Some components use **hardcoded data** instead of API calls
- **Role-based API restrictions** not fully implemented
- **Database migrations** configured but not automated

### Planned Enhancements
- [ ] **TypeScript Migration** for frontend type safety
- [ ] **Docker Compose** for easy deployment
- [ ] **Database Migrations** with Alembic automation  
- [ ] **Role-Based API Permissions** enforcement
- [ ] **Real-time WebSocket** updates for sensor data
- [ ] **Advanced Analytics** with historical trending
- [ ] **Email Notifications** for critical alerts
- [ ] **Mobile App** compatibility

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/awesome-feature`)
3. **Commit** your changes (`git commit -m 'Add awesome feature'`)
4. **Push** to the branch (`git push origin feature/awesome-feature`)
5. **Open** a Pull Request

### Development Guidelines
- **Backend**: Follow FastAPI best practices, use async/await
- **Frontend**: Use Material-UI components, maintain responsive design
- **Testing**: Add tests for new features
- **Documentation**: Update README and API docs

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Documentation**: See [DEMO.md](DEMO.md) for feature walkthrough
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- **Status**: See [STATUS.md](STATUS.md) for current development status
- **Issues**: Create an issue in this repository
- **Email**: support@producflow.com (if applicable)

---

## 🙏 Acknowledgments

- **FastAPI** for the excellent async web framework
- **Material-UI** for the professional React components
- **Chart.js** for interactive data visualizations
- **SQLAlchemy** for the powerful async ORM

---

**ProducFlow** - Empowering manufacturing excellence through real-time insights 🏭