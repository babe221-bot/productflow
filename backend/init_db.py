#!/usr/bin/env python3
"""
Initialize the database with tables and sample data (async)
"""

import asyncio
from app.database import engine, SessionLocal
from app.models import Base
from app.crud import init_sample_data

async def init_database():
    print("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Adding sample data...")
    async with SessionLocal() as db:
        await init_sample_data(db)

    print("Database initialized successfully!\n")
    print("Demo credentials:")
    print("Admin:    admin@producflow.com / admin123")
    print("Manager:  manager@producflow.com / manager123")
    print("Technician: tech@producflow.com / tech123")

if __name__ == "__main__":
    asyncio.run(init_database())