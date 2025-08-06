from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from typing import List, Optional
import uvicorn
import asyncio

from app.database import engine
from app import models, schemas, crud, auth
from app.models import Base

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(
    title="ProducFlow API",
    description="Manufacturing Management System API",
    version="1.0.0"
)

@app.on_event("startup")
async def on_startup():
    await create_tables()


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication endpoints
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(auth.get_db)
):
    user = await auth.authenticate_user(db, form_data.username, form_data.password)
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
async def read_equipment(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    equipment = await crud.get_equipment(db, skip=skip, limit=limit, status=status)
    return equipment

@app.get("/equipment/{equipment_id}", response_model=schemas.Equipment)
async def read_equipment_item(
    equipment_id: int,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    equipment = await crud.get_equipment_by_id(db, equipment_id=equipment_id)
    if equipment is None:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment

@app.post("/equipment", response_model=schemas.Equipment)
async def create_equipment(
    equipment: schemas.EquipmentCreate,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return await crud.create_equipment(db=db, equipment=equipment)

# Sensor data endpoints
@app.get("/equipment/{equipment_id}/sensors", response_model=List[schemas.SensorData])
async def read_sensor_data(
    equipment_id: int,
    limit: int = 100,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    sensor_data = await crud.get_sensor_data(db, equipment_id=equipment_id, limit=limit)
    return sensor_data

@app.post("/equipment/{equipment_id}/sensors", response_model=schemas.SensorData)
async def create_sensor_data(
    equipment_id: int,
    sensor_data: schemas.SensorDataCreate,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return await crud.create_sensor_data(db=db, sensor_data=sensor_data, equipment_id=equipment_id)

# Maintenance endpoints
@app.get("/maintenance", response_model=List[schemas.MaintenanceAlert])
async def read_maintenance_alerts(
    skip: int = 0,
    limit: int = 100,
    priority: Optional[str] = None,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    alerts = await crud.get_maintenance_alerts(db, skip=skip, limit=limit, priority=priority)
    return alerts

@app.post("/maintenance", response_model=schemas.MaintenanceAlert)
async def create_maintenance_alert(
    alert: schemas.MaintenanceAlertCreate,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return await crud.create_maintenance_alert(db=db, alert=alert)

# Production metrics endpoints
@app.get("/production/metrics", response_model=schemas.ProductionMetrics)
async def read_production_metrics(
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return await crud.get_production_metrics(db)

# Dashboard summary endpoint
@app.get("/dashboard/summary", response_model=schemas.DashboardSummary)
async def read_dashboard_summary(
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return await crud.get_dashboard_summary(db)

# Production records endpoints
@app.get("/production/records", response_model=List[schemas.ProductionRecord])
async def read_production_records(
    skip: int = 0,
    limit: int = 100,
    equipment_id: Optional[int] = None,
    shift: Optional[str] = None,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    records = await crud.get_production_records(db, skip=skip, limit=limit, equipment_id=equipment_id, shift=shift)
    return records

@app.get("/production/records/{record_id}", response_model=schemas.ProductionRecord)
async def read_production_record(
    record_id: int,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    record = await crud.get_production_record_by_id(db, record_id=record_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Production record not found")
    return record

@app.post("/production/records", response_model=schemas.ProductionRecord)
async def create_production_record(
    record: schemas.ProductionRecordCreate,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return await crud.create_production_record(db=db, record=record)

@app.put("/production/records/{record_id}", response_model=schemas.ProductionRecord)
async def update_production_record(
    record_id: int,
    record_update: schemas.ProductionRecordCreate,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    record = await crud.update_production_record(db, record_id=record_id, record_update=record_update)
    if record is None:
        raise HTTPException(status_code=404, detail="Production record not found")
    return record

# Shift management endpoints
@app.get("/production/shifts/summary", response_model=List[schemas.ShiftSummary])
async def read_shift_summary(
    date: datetime,
    shift: Optional[str] = None,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    summaries = await crud.get_shift_summary(db, date=date, shift=shift)
    return summaries

# Maintenance logs endpoints
@app.get("/maintenance/logs", response_model=List[schemas.MaintenanceLog])
async def read_maintenance_logs(
    skip: int = 0,
    limit: int = 100,
    equipment_id: Optional[int] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    logs = await crud.get_maintenance_logs(db, skip=skip, limit=limit, equipment_id=equipment_id, status=status)
    return logs

@app.get("/maintenance/logs/{log_id}", response_model=schemas.MaintenanceLog)
async def read_maintenance_log(
    log_id: int,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    log = await crud.get_maintenance_log_by_id(db, log_id=log_id)
    if log is None:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    return log

@app.post("/maintenance/logs", response_model=schemas.MaintenanceLog)
async def create_maintenance_log(
    log: schemas.MaintenanceLogCreate,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return await crud.create_maintenance_log(db=db, log=log)

@app.patch("/maintenance/logs/{log_id}/status")
async def update_maintenance_log_status(
    log_id: int,
    status: str,
    completed_date: Optional[datetime] = None,
    db: AsyncSession = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    log = await crud.update_maintenance_log_status(db, log_id=log_id, status=status, completed_date=completed_date)
    if log is None:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    return {"message": "Status updated successfully", "status": status}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)