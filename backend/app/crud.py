from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime, timedelta
import random

from . import models, schemas

# Equipment CRUD operations
def get_equipment(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None):
    query = db.query(models.Equipment)
    if status:
        query = query.filter(models.Equipment.status == status)
    return query.offset(skip).limit(limit).all()

def get_equipment_by_id(db: Session, equipment_id: int):
    return db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()

def create_equipment(db: Session, equipment: schemas.EquipmentCreate):
    db_equipment = models.Equipment(**equipment.dict())
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

# Sensor data CRUD operations
def get_sensor_data(db: Session, equipment_id: int, limit: int = 100):
    return db.query(models.SensorData).filter(
        models.SensorData.equipment_id == equipment_id
    ).order_by(desc(models.SensorData.timestamp)).limit(limit).all()

def create_sensor_data(db: Session, sensor_data: schemas.SensorDataCreate, equipment_id: int):
    db_sensor_data = models.SensorData(**sensor_data.dict(), equipment_id=equipment_id)
    db.add(db_sensor_data)
    db.commit()
    db.refresh(db_sensor_data)
    return db_sensor_data

# Maintenance alert CRUD operations
def get_maintenance_alerts(db: Session, skip: int = 0, limit: int = 100, priority: Optional[str] = None):
    query = db.query(models.MaintenanceAlert).filter(models.MaintenanceAlert.status == "active")
    if priority:
        query = query.filter(models.MaintenanceAlert.priority == priority)
    return query.offset(skip).limit(limit).all()

def create_maintenance_alert(db: Session, alert: schemas.MaintenanceAlertCreate):
    db_alert = models.MaintenanceAlert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

# Production metrics
def get_production_metrics(db: Session) -> schemas.ProductionMetrics:
    # Calculate metrics from production records
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    
    # Mock data for now - in real implementation, calculate from actual records
    return schemas.ProductionMetrics(
        total_output=12450,
        efficiency_percentage=92.3,
        defect_rate=2.1,
        downtime_hours=4.5,
        active_equipment=4,
        total_equipment=5
    )

# Dashboard summary
def get_dashboard_summary(db: Session) -> schemas.DashboardSummary:
    # Count equipment by status
    equipment_counts = db.query(
        models.Equipment.status,
        func.count(models.Equipment.id)
    ).group_by(models.Equipment.status).all()
    
    status_counts = {status: count for status, count in equipment_counts}
    
    # Count active alerts
    active_alerts = db.query(models.MaintenanceAlert).filter(
        models.MaintenanceAlert.status == "active"
    ).count()
    
    # Calculate production efficiency (mock for now)
    production_efficiency = 92.3
    
    # Calculate cost savings (mock for now)
    cost_savings = 45300.0
    
    return schemas.DashboardSummary(
        equipment_operational=status_counts.get("operational", 0),
        equipment_warning=status_counts.get("warning", 0),
        equipment_critical=status_counts.get("critical", 0),
        equipment_maintenance=status_counts.get("maintenance", 0),
        production_efficiency=production_efficiency,
        active_alerts=active_alerts,
        cost_savings=cost_savings
    )

# Initialize sample data
def init_sample_data(db: Session):
    # Check if data already exists
    if db.query(models.User).first():
        return
    
    # Create sample users
    from .auth import get_password_hash
    
    users = [
        models.User(
            email="admin@producflow.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            role="admin",
            department="IT"
        ),
        models.User(
            email="manager@producflow.com",
            hashed_password=get_password_hash("manager123"),
            full_name="Production Manager",
            role="manager",
            department="Production"
        ),
        models.User(
            email="tech@producflow.com",
            hashed_password=get_password_hash("tech123"),
            full_name="Maintenance Technician",
            role="technician",
            department="Maintenance"
        )
    ]
    
    for user in users:
        db.add(user)
    
    # Create sample equipment
    equipment_list = [
        models.Equipment(
            name="Injection Molding Machine #1",
            type="Molding",
            status="operational",
            location="Production Floor A",
            capacity=500.0,
            installation_date=datetime(2021, 5, 20),
            last_maintenance=datetime(2023, 10, 15),
            health_score=95.2
        ),
        models.Equipment(
            name="CNC Milling Machine #2",
            type="Milling",
            status="warning",
            location="Production Floor B",
            capacity=300.0,
            installation_date=datetime(2020, 8, 10),
            last_maintenance=datetime(2023, 9, 20),
            health_score=78.5
        ),
        models.Equipment(
            name="Conveyor System #1",
            type="Transport",
            status="operational",
            location="Assembly Line",
            capacity=1000.0,
            installation_date=datetime(2022, 1, 15),
            last_maintenance=datetime(2023, 10, 1),
            health_score=88.9
        ),
        models.Equipment(
            name="Robotic Arm #3",
            type="Assembly",
            status="critical",
            location="Assembly Station 3",
            capacity=200.0,
            installation_date=datetime(2021, 11, 5),
            last_maintenance=datetime(2023, 8, 15),
            health_score=45.3
        ),
        models.Equipment(
            name="Quality Control Scanner",
            type="Inspection",
            status="operational",
            location="QC Department",
            capacity=800.0,
            installation_date=datetime(2022, 6, 1),
            last_maintenance=datetime(2023, 10, 10),
            health_score=92.7
        )
    ]
    
    for equipment in equipment_list:
        db.add(equipment)
    
    db.commit()
    
    # Create sample sensor data
    sensor_types = ["temperature", "pressure", "vibration", "speed"]
    for equipment in equipment_list:
        for sensor_type in sensor_types:
            for i in range(10):  # 10 recent readings per sensor
                value = generate_sensor_value(sensor_type)
                sensor_data = models.SensorData(
                    equipment_id=equipment.id,
                    sensor_type=sensor_type,
                    value=value,
                    unit=get_sensor_unit(sensor_type),
                    status=get_sensor_status(sensor_type, value),
                    timestamp=datetime.now() - timedelta(minutes=i*5)
                )
                db.add(sensor_data)
    
    # Create sample maintenance alerts
    alerts = [
        models.MaintenanceAlert(
            equipment_id=2,  # CNC Milling Machine
            type="predictive",
            priority="high",
            title="Bearing Replacement Required",
            description="Vibration levels indicate bearing wear. Replacement recommended within 2 weeks.",
            predicted_date=datetime.now() + timedelta(days=14),
            confidence=0.85
        ),
        models.MaintenanceAlert(
            equipment_id=4,  # Robotic Arm
            type="emergency",
            priority="critical",
            title="Hydraulic System Failure",
            description="Hydraulic pressure below critical threshold. Immediate attention required.",
            predicted_date=datetime.now(),
            confidence=0.95
        )
    ]
    
    for alert in alerts:
        db.add(alert)
    
    db.commit()

def generate_sensor_value(sensor_type: str) -> float:
    """Generate realistic sensor values"""
    if sensor_type == "temperature":
        return round(random.uniform(65, 85), 1)
    elif sensor_type == "pressure":
        return round(random.uniform(45, 65), 1)
    elif sensor_type == "vibration":
        return round(random.uniform(0.1, 2.5), 2)
    elif sensor_type == "speed":
        return round(random.uniform(1200, 1800), 0)
    return 0.0

def get_sensor_unit(sensor_type: str) -> str:
    """Get unit for sensor type"""
    units = {
        "temperature": "°C",
        "pressure": "PSI",
        "vibration": "mm/s",
        "speed": "RPM"
    }
    return units.get(sensor_type, "")

def get_sensor_status(sensor_type: str, value: float) -> str:
    """Determine sensor status based on value"""
    if sensor_type == "temperature":
        if value > 80:
            return "warning"
        elif value > 85:
            return "critical"
    elif sensor_type == "pressure":
        if value < 50 or value > 60:
            return "warning"
        elif value < 45 or value > 65:
            return "critical"
    elif sensor_type == "vibration":
        if value > 2.0:
            return "warning"
        elif value > 2.5:
            return "critical"
    elif sensor_type == "speed":
        if value < 1300 or value > 1700:
            return "warning"
        elif value < 1200 or value > 1800:
            return "critical"
    
    return "normal"