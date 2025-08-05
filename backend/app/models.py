from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default="operator")  # admin, manager, technician, operator
    department = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    status = Column(String, default="operational")  # operational, warning, critical, maintenance
    location = Column(String)
    capacity = Column(Float)
    installation_date = Column(DateTime(timezone=True))
    last_maintenance = Column(DateTime(timezone=True))
    health_score = Column(Float, default=100.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    sensor_data = relationship("SensorData", back_populates="equipment")
    maintenance_alerts = relationship("MaintenanceAlert", back_populates="equipment")

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    sensor_type = Column(String)  # temperature, pressure, vibration, speed
    value = Column(Float)
    unit = Column(String)
    status = Column(String, default="normal")  # normal, warning, critical
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    equipment = relationship("Equipment", back_populates="sensor_data")

class MaintenanceAlert(Base):
    __tablename__ = "maintenance_alerts"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    type = Column(String)  # predictive, scheduled, emergency
    priority = Column(String)  # low, medium, high, critical
    title = Column(String)
    description = Column(Text)
    predicted_date = Column(DateTime(timezone=True))
    confidence = Column(Float)
    status = Column(String, default="active")  # active, acknowledged, resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))

    # Relationships
    equipment = relationship("Equipment", back_populates="maintenance_alerts")

class ProductionRecord(Base):
    __tablename__ = "production_records"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    shift = Column(String)  # morning, afternoon, night
    output_quantity = Column(Integer)
    defect_quantity = Column(Integer, default=0)
    downtime_minutes = Column(Integer, default=0)
    efficiency_percentage = Column(Float)
    date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    maintenance_type = Column(String)  # preventive, corrective, emergency
    description = Column(Text)
    technician_id = Column(Integer, ForeignKey("users.id"))
    cost = Column(Float)
    duration_hours = Column(Float)
    parts_replaced = Column(Text)
    status = Column(String, default="completed")  # scheduled, in_progress, completed
    scheduled_date = Column(DateTime(timezone=True))
    completed_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())