#!/usr/bin/env python3
"""
Initialize the database with sample data for ProducFlow
"""

from app.database import SessionLocal, engine
from app.models import Base
from app.crud import init_sample_data

def init_database():
    """Initialize database with tables and sample data"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Adding sample data...")
    db = SessionLocal()
    try:
        init_sample_data(db)
        print("Database initialized successfully!")
        print("\nDemo credentials:")
        print("Admin: admin@producflow.com / admin123")
        print("Manager: manager@producflow.com / manager123")
        print("Technician: tech@producflow.com / tech123")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_database()