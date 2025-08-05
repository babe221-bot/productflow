from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "operator"
    department: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Equipment schemas
class EquipmentBase(BaseModel):
    name: str
    type: str
    location: str
    capacity: Optional[float] = None
    installation_date: Optional[datetime] = None

class EquipmentCreate(EquipmentBase):
    pass

class Equipment(EquipmentBase):
    id: int
    status: str
    health_score: float
    last_maintenance: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Sensor data schemas
class SensorDataBase(BaseModel):
    sensor_type: str
    value: float
    unit: str
    status: str = "normal"

class SensorDataCreate(SensorDataBase):
    pass

class SensorData(SensorDataBase):
    id: int
    equipment_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Maintenance alert schemas
class MaintenanceAlertBase(BaseModel):
    type: str
    priority: str
    title: str
    description: str
    predicted_date: Optional[datetime] = None
    confidence: Optional[float] = None

class MaintenanceAlertCreate(MaintenanceAlertBase):
    equipment_id: int

class MaintenanceAlert(MaintenanceAlertBase):
    id: int
    equipment_id: int
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Production metrics schemas
class ProductionMetrics(BaseModel):
    total_output: int
    efficiency_percentage: float
    defect_rate: float
    downtime_hours: float
    active_equipment: int
    total_equipment: int

# Dashboard summary schemas
class DashboardSummary(BaseModel):
    equipment_operational: int
    equipment_warning: int
    equipment_critical: int
    equipment_maintenance: int
    production_efficiency: float
    active_alerts: int
    cost_savings: float
    
    class Config:
        from_attributes = True

# Production record schemas
class ProductionRecordBase(BaseModel):
    shift: str  # morning, afternoon, night
    output_quantity: int
    defect_quantity: int = 0
    downtime_minutes: int = 0
    efficiency_percentage: Optional[float] = None
    date: datetime

class ProductionRecordCreate(ProductionRecordBase):
    equipment_id: int

class ProductionRecord(ProductionRecordBase):
    id: int
    equipment_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Maintenance log schemas
class MaintenanceLogBase(BaseModel):
    maintenance_type: str  # preventive, corrective, emergency
    description: str
    cost: Optional[float] = None
    duration_hours: Optional[float] = None
    parts_replaced: Optional[str] = None
    scheduled_date: Optional[datetime] = None

class MaintenanceLogCreate(MaintenanceLogBase):
    equipment_id: int
    technician_id: int

class MaintenanceLog(MaintenanceLogBase):
    id: int
    equipment_id: int
    technician_id: int
    status: str
    completed_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Shift summary schemas
class ShiftSummary(BaseModel):
    shift: str
    date: datetime
    total_output: int
    total_defects: int
    total_downtime: int
    average_efficiency: float
    equipment_count: int

# Equipment with sensor data
class EquipmentWithSensors(Equipment):
    sensor_data: List[SensorData] = []
    maintenance_alerts: List[MaintenanceAlert] = []

    class Config:
        from_attributes = True