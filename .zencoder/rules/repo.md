---
description: Repository Information Overview
alwaysApply: true
---

# ProducFlow Information

## Summary
ProducFlow is a comprehensive manufacturing process automation platform designed to help manufacturing facilities monitor equipment, predict maintenance needs, track production metrics, and manage personnel. Built with a modern React frontend and FastAPI backend, it provides real-time insights into manufacturing operations through an intuitive dashboard.

## Structure
- **backend/**: FastAPI backend with SQLAlchemy ORM and SQLite database
- **frontend/**: React 18 frontend with TypeScript and Material-UI
- **docker-compose.prod.yml**: Production Docker configuration
- **Dockerfile.backend/frontend**: Docker build configurations
- **start_producflow.py**: Main startup script for development
- **deploy.sh**: Production deployment script

## Language & Runtime
**Backend Language**: Python 3.8+
**Frontend Language**: TypeScript/JavaScript
**Backend Runtime**: FastAPI with Uvicorn/Gunicorn
**Frontend Runtime**: React 18
**Build System**: npm (frontend), pip (backend)
**Package Manager**: npm (frontend), pip (backend)

## Dependencies
**Backend Dependencies**:
- fastapi>=0.100.0
- uvicorn[standard]>=0.23.0
- sqlalchemy[asyncio]>=2.0.0
- pydantic>=2.0.0
- python-jose[cryptography]>=3.3.0
- passlib[bcrypt]>=1.7.4

**Frontend Dependencies**:
- react 18.2.0
- @mui/material 5.14.20
- @mui/icons-material 5.14.19
- axios 1.6.2
- chart.js 4.4.0
- react-router-dom 6.20.1

## Build & Installation
**Backend Setup**:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python init_db.py
uvicorn main:app --reload
```

**Frontend Setup**:
```bash
cd frontend
npm install
npm start
```

**Automated Setup**:
```bash
python start_producflow.py
```

## Docker
**Docker Compose**: docker-compose.prod.yml
**Backend Image**: Python 3.11-slim with Gunicorn
**Frontend Image**: Multi-stage build with Node.js 18 and Nginx
**Configuration**: Environment variables for database, security, and CORS

**Docker Deployment**:
```bash
cp .env.example .env
# Edit .env with production values
docker-compose -f docker-compose.prod.yml up -d
```

## Testing
**Backend Testing**:
```bash
python test_backend.py
```

## Current Status
The project appears to be fully functional in development mode but may have deployment issues. The STATUS.md file indicates the project is "FULLY FUNCTIONAL" with all components completed, but there might be configuration issues preventing proper deployment.

Key issues to check:
1. Environment variables configuration
2. Database connection settings
3. CORS configuration for production
4. Frontend API endpoint configuration
5. Docker deployment settings

The project uses SQLite by default for development but recommends PostgreSQL for production. Make sure the database connection string is properly configured in the production environment.