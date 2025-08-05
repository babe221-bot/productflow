# ProducFlow Manufacturing Management System

![ProducFlow Dashboard](https://placehold.co/1200x600?text=ProducFlow+Dashboard+Preview)

ProducFlow is a comprehensive manufacturing process automation platform designed to help manufacturing facilities monitor equipment, predict maintenance needs, track production metrics, and manage personnel. Built with a modern React interface and FastAPI backend, it provides real-time insights into manufacturing operations through an intuitive dashboard.

## Features

### 📊 Real-time Equipment Monitoring
- Track the status of all manufacturing equipment
- View real-time sensor data (temperature, vibration, pressure, etc.)
- Filter by operational status (operational, warning, critical)

### 🔧 Predictive Maintenance
- AI-driven maintenance predictions with confidence scores
- Priority-based alert system (critical, high, medium, low)
- Maintenance log tracking and history

### 📈 Production Analytics
- Monitor production efficiency metrics
- Track output and defect rates
- Analyze downtime patterns
- Visualize trends over time

### 👥 User Management
- Role-based access control (admin, manager, technician, operator)
- Department assignments
- User activity tracking

## Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.8+** - Core programming language
- **SQLAlchemy** - Database ORM
- **PostgreSQL/SQLite** - Database
- **Pydantic** - Data validation and serialization

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Chart.js** - Data visualization
- **Material-UI** - Component library
- **Axios** - HTTP client

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
productflow/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   └── services/
│   ├── requirements.txt
│   └── main.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## Key Components

### Authentication System
- Login/Logout functionality
- Session management
- Role-based access control (admin, manager, technician, operator)

### Equipment Management
- Equipment listing with status filtering (operational, warning, critical)
- Equipment details with real-time sensor data visualization
- CRUD operations for equipment records

### Maintenance System
- Maintenance prediction alerts with priority levels
- Maintenance log tracking
- Preventive and corrective maintenance scheduling

### Production Monitoring
- Production efficiency metrics
- Output tracking
- Defect rate monitoring
- Downtime analysis

### User Management
- User role administration
- Department assignments
- Access control

## Data Models

### Equipment
```json
{
  "id": 1,
  "name": "Injection Molding Machine #1",
  "type": "Molding",
  "status": "operational",
  "last_maintenance": "2023-10-15T10:00:00Z",
  "installation_date": "2021-05-20T08:00:00Z",
  "location": "Production Floor A",
  "capacity": 500
}
```

### Sensor Data
```json
{
  "id": 1,
  "equipment_id": 1,
  "sensor_type": "temperature",
  "value": 75.5,
  "unit": "°C",
  "timestamp": "2023-10-20T14:30:00Z",
  "status": "normal"
}
```

### Maintenance Alert
```json
{
  "id": 1,
  "equipment_id": 1,
  "type": "predictive",
  "priority": "high",
  "description": "Bearing replacement recommended",
  "predicted_date": "2023-11-01T00:00:00Z",
  "confidence": 0.85
}
```

## Demo Credentials

For testing purposes, you can use these demo credentials:
- **Admin**: admin@producflow.com / admin123
- **Manager**: manager@producflow.com / manager123
- **Technician**: tech@producflow.com / tech123

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@producflow.com or create an issue in this repository.