from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Optional
from datetime import datetime, timedelta
import random

from . import models, schemas

# Equipment CRUD operations
async def get_equipment(db: AsyncSession, skip: int = 0, limit: int = 100, status: Optional[str] = None):
    query = select(models.Equipment)
    if status:
        query = query.filter(models.Equipment.status == status)
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

async def get_equipment_by_id(db: AsyncSession, equipment_id: int):
    result = await db.execute(select(models.Equipment).filter(models.Equipment.id == equipment_id))
    return result.scalar_one_or_none()

async def create_equipment(db: AsyncSession, equipment: schemas.EquipmentCreate):
    db_equipment = models.Equipment(**equipment.dict())
    db.add(db_equipment)
    await db.commit()
    await db.refresh(db_equipment)
    return db_equipment

# Sensor data CRUD operations
async def get_sensor_data(db: AsyncSession, equipment_id: int, limit: int = 100):
    result = await db.execute(
        select(models.SensorData)
        .filter(models.SensorData.equipment_id == equipment_id)
        .order_by(desc(models.SensorData.timestamp))
        .limit(limit)
    )
    return result.scalars().all()

async def create_sensor_data(db: AsyncSession, sensor_data: schemas.SensorDataCreate, equipment_id: int):
    db_sensor_data = models.SensorData(**sensor_data.dict(), equipment_id=equipment_id)
    db.add(db_sensor_data)
    await db.commit()
    await db.refresh(db_sensor_data)
    return db_sensor_data

# Maintenance alert CRUD operations
async def get_maintenance_alerts(db: AsyncSession, skip: int = 0, limit: int = 100, priority: Optional[str] = None):
    query = select(models.MaintenanceAlert).filter(models.MaintenanceAlert.status == "active")
    if priority:
        query = query.filter(models.MaintenanceAlert.priority == priority)
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

async def create_maintenance_alert(db: AsyncSession, alert: schemas.MaintenanceAlertCreate):
    db_alert = models.MaintenanceAlert(**alert.dict())
    db.add(db_alert)
    await db.commit()
    await db.refresh(db_alert)
    return db_alert

# Production metrics
async def get_production_metrics(db: AsyncSession) -> schemas.ProductionMetrics:
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    
    result = await db.execute(
        select(models.ProductionRecord).filter(func.date(models.ProductionRecord.date) >= week_ago)
    )
    records = result.scalars().all()
    
    total_equipment_result = await db.execute(select(func.count()).select_from(models.Equipment))
    total_equipment = total_equipment_result.scalar_one()

    if not records:
        return schemas.ProductionMetrics(
            total_output=0,
            efficiency_percentage=0.0,
            defect_rate=0.0,
            downtime_hours=0.0,
            active_equipment=0,
            total_equipment=total_equipment
        )
    
    total_output = sum(r.output_quantity for r in records)
    total_defects = sum(r.defect_quantity for r in records)
    total_downtime_minutes = sum(r.downtime_minutes for r in records)
    average_efficiency = sum(r.efficiency_percentage for r in records) / len(records)
    defect_rate = (total_defects / total_output * 100) if total_output > 0 else 0
    downtime_hours = total_downtime_minutes / 60
    active_equipment = len(set(r.equipment_id for r in records))
    
    return schemas.ProductionMetrics(
        total_output=total_output,
        efficiency_percentage=round(average_efficiency, 2),
        defect_rate=round(defect_rate, 2),
        downtime_hours=round(downtime_hours, 2),
        active_equipment=active_equipment,
        total_equipment=total_equipment
    )

# Dashboard summary
async def get_dashboard_summary(db: AsyncSession) -> schemas.DashboardSummary:
    equipment_counts_result = await db.execute(
        select(models.Equipment.status, func.count(models.Equipment.id))
        .group_by(models.Equipment.status)
    )
    status_counts = {status: count for status, count in equipment_counts_result.all()}
    
    active_alerts_result = await db.execute(
        select(func.count())
        .select_from(models.MaintenanceAlert)
        .filter(models.MaintenanceAlert.status == "active")
    )
    active_alerts = active_alerts_result.scalar_one()
    
    production_efficiency = 92.3
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
async def init_sample_data(db: AsyncSession):
    first_user_result = await db.execute(select(models.User).limit(1))
    if first_user_result.scalars().first():
        return
    
    from .auth import get_password_hash
    
    users = [
        models.User(email="admin@producflow.com", hashed_password=get_password_hash("admin123"), full_name="Admin User", role="admin", department="IT"),
        models.User(email="manager@producflow.com", hashed_password=get_password_hash("manager123"), full_name="Production Manager", role="manager", department="Production"),
        models.User(email="tech@producflow.com", hashed_password=get_password_hash("tech123"), full_name="Maintenance Technician", role="technician", department="Maintenance")
    ]
    db.add_all(users)
    
    equipment_list = [
        models.Equipment(name="Injection Molding Machine #1", type="Molding", status="operational", location="Production Floor A", capacity=500.0, installation_date=datetime(2021, 5, 20), last_maintenance=datetime(2023, 10, 15), health_score=95.2),
        models.Equipment(name="CNC Milling Machine #2", type="Milling", status="warning", location="Production Floor B", capacity=300.0, installation_date=datetime(2020, 8, 10), last_maintenance=datetime(2023, 9, 20), health_score=78.5),
        models.Equipment(name="Conveyor System #1", type="Transport", status="operational", location="Assembly Line", capacity=1000.0, installation_date=datetime(2022, 1, 15), last_maintenance=datetime(2023, 10, 1), health_score=88.9),
        models.Equipment(name="Robotic Arm #3", type="Assembly", status="critical", location="Assembly Station 3", capacity=200.0, installation_date=datetime(2021, 11, 5), last_maintenance=datetime(2023, 8, 15), health_score=45.3),
        models.Equipment(name="Quality Control Scanner", type="Inspection", status="operational", location="QC Department", capacity=800.0, installation_date=datetime(2022, 6, 1), last_maintenance=datetime(2023, 10, 10), health_score=92.7)
    ]
    db.add_all(equipment_list)
    await db.commit()
    
    sensor_types = ["temperature", "pressure", "vibration", "speed"]
    for equipment in equipment_list:
        for sensor_type in sensor_types:
            for i in range(10):
                value = generate_sensor_value(sensor_type)
                sensor_data = models.SensorData(equipment_id=equipment.id, sensor_type=sensor_type, value=value, unit=get_sensor_unit(sensor_type), status=get_sensor_status(sensor_type, value), timestamp=datetime.now() - timedelta(minutes=i*5))
                db.add(sensor_data)

    alerts = [
        models.MaintenanceAlert(equipment_id=2, type="predictive", priority="high", title="Bearing Replacement Required", description="Vibration levels indicate bearing wear. Replacement recommended within 2 weeks.", predicted_date=datetime.now() + timedelta(days=14), confidence=0.85),
        models.MaintenanceAlert(equipment_id=4, type="emergency", priority="critical", title="Hydraulic System Failure", description="Hydraulic pressure below critical threshold. Immediate attention required.", predicted_date=datetime.now(), confidence=0.95)
    ]
    db.add_all(alerts)
    await db.commit()

    production_records = [
        models.ProductionRecord(equipment_id=1, shift="morning", output_quantity=450, defect_quantity=8, downtime_minutes=15, efficiency_percentage=96.9, date=datetime.now() - timedelta(days=1)),
        models.ProductionRecord(equipment_id=1, shift="afternoon", output_quantity=420, defect_quantity=12, downtime_minutes=30, efficiency_percentage=93.8, date=datetime.now() - timedelta(days=1)),
        models.ProductionRecord(equipment_id=2, shift="morning", output_quantity=280, defect_quantity=5, downtime_minutes=45, efficiency_percentage=90.6, date=datetime.now() - timedelta(days=1)),
        models.ProductionRecord(equipment_id=3, shift="morning", output_quantity=950, defect_quantity=15, downtime_minutes=10, efficiency_percentage=97.9, date=datetime.now() - timedelta(days=1))
    ]
    db.add_all(production_records)

    maintenance_logs = [
        models.MaintenanceLog(equipment_id=1, maintenance_type="preventive", description="Regular lubrication and filter replacement", technician_id=3, cost=250.00, duration_hours=2.5, parts_replaced="Oil filter, hydraulic fluid", status="completed", scheduled_date=datetime.now() - timedelta(days=7), completed_date=datetime.now() - timedelta(days=7, hours=2)),
        models.MaintenanceLog(equipment_id=2, maintenance_type="corrective", description="Replace worn bearing in spindle assembly", technician_id=3, cost=850.00, duration_hours=4.0, parts_replaced="Spindle bearing assembly", status="completed", scheduled_date=datetime.now() - timedelta(days=3), completed_date=datetime.now() - timedelta(days=3, hours=4)),
        models.MaintenanceLog(equipment_id=4, maintenance_type="emergency", description="Hydraulic system repair - critical failure", technician_id=3, cost=1200.00, duration_hours=6.0, parts_replaced="Hydraulic pump, pressure valve", status="in_progress", scheduled_date=datetime.now())
    ]
    db.add_all(maintenance_logs)
    await db.commit()

def generate_sensor_value(sensor_type: str) -> float:
    if sensor_type == "temperature": return round(random.uniform(65, 85), 1)
    if sensor_type == "pressure": return round(random.uniform(45, 65), 1)
    if sensor_type == "vibration": return round(random.uniform(0.1, 2.5), 2)
    if sensor_type == "speed": return round(random.uniform(1200, 1800), 0)
    return 0.0

def get_sensor_unit(sensor_type: str) -> str:
    return {"temperature": "°C", "pressure": "PSI", "vibration": "mm/s", "speed": "RPM"}.get(sensor_type, "")

def get_sensor_status(sensor_type: str, value: float) -> str:
    if sensor_type == "temperature":
        if value > 80: return "warning"
        if value > 85: return "critical"
    elif sensor_type == "pressure":
        if value < 50 or value > 60: return "warning"
        if value < 45 or value > 65: return "critical"
    elif sensor_type == "vibration":
        if value > 2.0: return "warning"
        if value > 2.5: return "critical"
    elif sensor_type == "speed":
        if value < 1300 or value > 1700: return "warning"
        if value < 1200 or value > 1800: return "critical"
    return "normal"

async def get_production_records(db: AsyncSession, skip: int = 0, limit: int = 100, equipment_id: Optional[int] = None, shift: Optional[str] = None):
    query = select(models.ProductionRecord)
    if equipment_id: query = query.filter(models.ProductionRecord.equipment_id == equipment_id)
    if shift: query = query.filter(models.ProductionRecord.shift == shift)
    result = await db.execute(query.order_by(desc(models.ProductionRecord.date)).offset(skip).limit(limit))
    return result.scalars().all()

async def get_production_record_by_id(db: AsyncSession, record_id: int):
    result = await db.execute(select(models.ProductionRecord).filter(models.ProductionRecord.id == record_id))
    return result.scalar_one_or_none()

async def create_production_record(db: AsyncSession, record: schemas.ProductionRecordCreate):
    if record.efficiency_percentage is None:
        total_time = 8 * 60
        productive_time = total_time - record.downtime_minutes
        record.efficiency_percentage = (productive_time / total_time) * 100 if total_time > 0 else 0
    
    db_record = models.ProductionRecord(**record.dict())
    db.add(db_record)
    await db.commit()
    await db.refresh(db_record)
    return db_record

async def update_production_record(db: AsyncSession, record_id: int, record_update: schemas.ProductionRecordCreate):
    db_record = await get_production_record_by_id(db, record_id)
    if db_record:
        for key, value in record_update.dict(exclude_unset=True).items():
            setattr(db_record, key, value)
        await db.commit()
        await db.refresh(db_record)
    return db_record

async def get_maintenance_logs(db: AsyncSession, skip: int = 0, limit: int = 100, equipment_id: Optional[int] = None, status: Optional[str] = None):
    query = select(models.MaintenanceLog)
    if equipment_id: query = query.filter(models.MaintenanceLog.equipment_id == equipment_id)
    if status: query = query.filter(models.MaintenanceLog.status == status)
    result = await db.execute(query.order_by(desc(models.MaintenanceLog.created_at)).offset(skip).limit(limit))
    return result.scalars().all()

async def get_maintenance_log_by_id(db: AsyncSession, log_id: int):
    result = await db.execute(select(models.MaintenanceLog).filter(models.MaintenanceLog.id == log_id))
    return result.scalar_one_or_none()

async def create_maintenance_log(db: AsyncSession, log: schemas.MaintenanceLogCreate):
    db_log = models.MaintenanceLog(**log.dict())
    db.add(db_log)
    await db.commit()
    await db.refresh(db_log)
    return db_log

async def update_maintenance_log_status(db: AsyncSession, log_id: int, status: str, completed_date: Optional[datetime] = None):
    db_log = await get_maintenance_log_by_id(db, log_id)
    if db_log:
        db_log.status = status
        if completed_date:
            db_log.completed_date = completed_date
        elif status == "completed":
            db_log.completed_date = datetime.now()
        await db.commit()
        await db.refresh(db_log)
    return db_log

async def get_shift_summary(db: AsyncSession, date: datetime, shift: Optional[str] = None):
    query = select(models.ProductionRecord).filter(func.date(models.ProductionRecord.date) == date.date())
    if shift: query = query.filter(models.ProductionRecord.shift == shift)
    
    result = await db.execute(query)
    records = result.scalars().all()
    
    if not records: return []
    
    if not shift:
        shift_groups = {}
        for record in records:
            if record.shift not in shift_groups: shift_groups[record.shift] = []
            shift_groups[record.shift].append(record)
        
        summaries = [calculate_shift_summary(shift_name, date, shift_records) for shift_name, shift_records in shift_groups.items()]
        return summaries
    else:
        return [calculate_shift_summary(shift, date, records)]

def calculate_shift_summary(shift: str, date: datetime, records: List[models.ProductionRecord]) -> schemas.ShiftSummary:
    total_output = sum(r.output_quantity for r in records)
    total_defects = sum(r.defect_quantity for r in records)
    total_downtime = sum(r.downtime_minutes for r in records)
    average_efficiency = sum(r.efficiency_percentage for r in records) / len(records) if records else 0
    equipment_count = len(set(r.equipment_id for r in records))
    
    return schemas.ShiftSummary(
        shift=shift,
        date=date,
        total_output=total_output,
        total_defects=total_defects,
        total_downtime=total_downtime,
        average_efficiency=round(average_efficiency, 2),
        equipment_count=equipment_count
    )