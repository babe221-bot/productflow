from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import uvicorn

from app.database import SessionLocal, engine
from app import models, schemas, crud, auth
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProducFlow API",
    description="Manufacturing Management System API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication endpoints
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(
    current_user: models.User = Depends(auth.get_current_user)
):
    return current_user

# Equipment endpoints
@app.get("/equipment", response_model=List[schemas.Equipment])
def read_equipment(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    equipment = crud.get_equipment(db, skip=skip, limit=limit, status=status)
    return equipment

@app.get("/equipment/{equipment_id}", response_model=schemas.Equipment)
def read_equipment_item(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    equipment = crud.get_equipment_by_id(db, equipment_id=equipment_id)
    if equipment is None:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment

@app.post("/equipment", response_model=schemas.Equipment)
def create_equipment(
    equipment: schemas.EquipmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_equipment(db=db, equipment=equipment)

# Sensor data endpoints
@app.get("/equipment/{equipment_id}/sensors", response_model=List[schemas.SensorData])
def read_sensor_data(
    equipment_id: int,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    sensor_data = crud.get_sensor_data(db, equipment_id=equipment_id, limit=limit)
    return sensor_data

@app.post("/equipment/{equipment_id}/sensors", response_model=schemas.SensorData)
def create_sensor_data(
    equipment_id: int,
    sensor_data: schemas.SensorDataCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_sensor_data(db=db, sensor_data=sensor_data, equipment_id=equipment_id)

# Maintenance endpoints
@app.get("/maintenance", response_model=List[schemas.MaintenanceAlert])
def read_maintenance_alerts(
    skip: int = 0,
    limit: int = 100,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    alerts = crud.get_maintenance_alerts(db, skip=skip, limit=limit, priority=priority)
    return alerts

@app.post("/maintenance", response_model=schemas.MaintenanceAlert)
def create_maintenance_alert(
    alert: schemas.MaintenanceAlertCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_maintenance_alert(db=db, alert=alert)

# Production metrics endpoints
@app.get("/production/metrics", response_model=schemas.ProductionMetrics)
def read_production_metrics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_production_metrics(db)

# Dashboard summary endpoint
@app.get("/dashboard/summary", response_model=schemas.DashboardSummary)
def read_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_dashboard_summary(db)

# Production records endpoints
@app.get("/production/records", response_model=List[schemas.ProductionRecord])
def read_production_records(
    skip: int = 0,
    limit: int = 100,
    equipment_id: Optional[int] = None,
    shift: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    records = crud.get_production_records(db, skip=skip, limit=limit, equipment_id=equipment_id, shift=shift)
    return records

@app.get("/production/records/{record_id}", response_model=schemas.ProductionRecord)
def read_production_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    record = crud.get_production_record_by_id(db, record_id=record_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Production record not found")
    return record

@app.post("/production/records", response_model=schemas.ProductionRecord)
def create_production_record(
    record: schemas.ProductionRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_production_record(db=db, record=record)

@app.put("/production/records/{record_id}", response_model=schemas.ProductionRecord)
def update_production_record(
    record_id: int,
    record_update: schemas.ProductionRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    record = crud.update_production_record(db, record_id=record_id, record_update=record_update)
    if record is None:
        raise HTTPException(status_code=404, detail="Production record not found")
    return record

# Shift management endpoints
@app.get("/production/shifts/summary", response_model=List[schemas.ShiftSummary])
def read_shift_summary(
    date: datetime,
    shift: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    summaries = crud.get_shift_summary(db, date=date, shift=shift)
    return summaries

# Maintenance logs endpoints
@app.get("/maintenance/logs", response_model=List[schemas.MaintenanceLog])
def read_maintenance_logs(
    skip: int = 0,
    limit: int = 100,
    equipment_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    logs = crud.get_maintenance_logs(db, skip=skip, limit=limit, equipment_id=equipment_id, status=status)
    return logs

@app.get("/maintenance/logs/{log_id}", response_model=schemas.MaintenanceLog)
def read_maintenance_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    log = crud.get_maintenance_log_by_id(db, log_id=log_id)
    if log is None:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    return log

@app.post("/maintenance/logs", response_model=schemas.MaintenanceLog)
def create_maintenance_log(
    log: schemas.MaintenanceLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_maintenance_log(db=db, log=log)

@app.patch("/maintenance/logs/{log_id}/status")
def update_maintenance_log_status(
    log_id: int,
    status: str,
    completed_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    log = crud.update_maintenance_log_status(db, log_id=log_id, status=status, completed_date=completed_date)
    if log is None:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    return {"message": "Status updated successfully", "status": status}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)