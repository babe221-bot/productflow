#!/usr/bin/env python3
"""
Startup script for ProducFlow backend
"""

import subprocess
import sys
import os
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.8 or higher"""
    if sys.version_info < (3, 8):
        print("Error: Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✓ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_dependencies():
    """Install required dependencies"""
    print("Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print("✓ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("Error: Failed to install dependencies")
        sys.exit(1)

def initialize_database():
    """Initialize database with sample data"""
    print("Initializing database...")
    try:
        os.chdir("backend")
        subprocess.check_call([sys.executable, "init_db.py"])
        print("✓ Database initialized successfully")
    except subprocess.CalledProcessError:
        print("Error: Failed to initialize database")
        sys.exit(1)

def start_server():
    """Start the FastAPI server"""
    print("Starting ProducFlow backend server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation will be available at: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    
    try:
        subprocess.check_call([sys.executable, "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
    except subprocess.CalledProcessError:
        print("Error: Failed to start server")
        sys.exit(1)

def main():
    """Main startup function"""
    print("🏭 ProducFlow Backend Startup")
    print("=" * 40)
    
    # Change to project root directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    check_python_version()
    install_dependencies()
    initialize_database()
    start_server()

if __name__ == "__main__":
    main()