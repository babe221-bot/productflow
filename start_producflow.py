#!/usr/bin/env python3
"""
Complete startup script for ProducFlow Manufacturing Management System
"""

import subprocess
import sys
import os
import time
import threading
from pathlib import Path

def print_banner():
    """Print ProducFlow banner"""
    banner = """
🏭 ProducFlow Manufacturing Management System
=============================================
    
    Real-time Equipment Monitoring
    Predictive Maintenance Alerts  
    Production Analytics Dashboard
    User Management System
    
=============================================
"""
    print(banner)

def check_requirements():
    """Check system requirements"""
    print("Checking system requirements...")
    
    # Check Python
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✓ Python {sys.version_info.major}.{sys.version_info.minor}")
    
    # Check Node.js
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✓ Node.js {result.stdout.strip()}")
        else:
            raise FileNotFoundError
    except FileNotFoundError:
        print("❌ Error: Node.js is not installed")
        print("Please install Node.js from https://nodejs.org/")
        sys.exit(1)
    
    # Check npm
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✓ npm {result.stdout.strip()}")
        else:
            raise FileNotFoundError
    except FileNotFoundError:
        print("❌ Error: npm is not installed")
        sys.exit(1)

def setup_backend():
    """Setup and start backend"""
    print("\n📦 Setting up backend...")
    
    try:
        # Install Python dependencies
        print("Installing Python dependencies...")
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("✓ Python dependencies installed")
        
        # Initialize database
        print("Initializing database...")
        original_dir = os.getcwd()
        os.chdir("backend")
        subprocess.check_call([sys.executable, "init_db.py"])
        os.chdir(original_dir)
        print("✓ Database initialized with sample data")
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend setup failed: {e}")
        return False

def setup_frontend():
    """Setup frontend"""
    print("\n🖥️  Setting up frontend...")
    
    try:
        # Install Node.js dependencies
        print("Installing Node.js dependencies...")
        original_dir = os.getcwd()
        os.chdir("frontend")
        subprocess.check_call(["npm", "install"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        os.chdir(original_dir)
        print("✓ Node.js dependencies installed")
        
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend setup failed: {e}")
        return False

def start_backend_server():
    """Start backend server in a separate thread"""
    def run_backend():
        try:
            os.chdir("backend")
            subprocess.check_call([
                sys.executable, "-m", "uvicorn", "main:app", 
                "--reload", "--host", "0.0.0.0", "--port", "8000"
            ])
        except subprocess.CalledProcessError:
            print("❌ Backend server failed to start")
        except KeyboardInterrupt:
            pass
    
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    backend_thread.start()
    return backend_thread

def start_frontend_server():
    """Start frontend development server"""
    try:
        os.chdir("frontend")
        subprocess.check_call(["npm", "start"])
    except subprocess.CalledProcessError:
        print("❌ Frontend server failed to start")
    except KeyboardInterrupt:
        print("\n✓ Servers stopped")

def wait_for_backend():
    """Wait for backend to be ready"""
    import requests
    import time
    
    print("⏳ Waiting for backend to start...")
    for i in range(30):  # Wait up to 30 seconds
        try:
            response = requests.get("http://localhost:8000/docs", timeout=1)
            if response.status_code == 200:
                print("✓ Backend server is ready")
                return True
        except:
            pass
        time.sleep(1)
    
    print("⚠️  Backend may still be starting...")
    return False

def print_access_info():
    """Print access information"""
    info = """
🚀 ProducFlow is now running!

📊 Frontend Application:  http://localhost:3000
🔧 Backend API:           http://localhost:8000
📚 API Documentation:     http://localhost:8000/docs

👤 Demo Login Credentials:
   Admin:      admin@producflow.com / admin123
   Manager:    manager@producflow.com / manager123  
   Technician: tech@producflow.com / tech123

Press Ctrl+C to stop all servers
"""
    print(info)

def main():
    """Main startup function"""
    print_banner()
    
    # Change to project root directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    # Check requirements
    check_requirements()
    
    # Setup backend and frontend
    if not setup_backend():
        sys.exit(1)
    
    if not setup_frontend():
        sys.exit(1)
    
    print("\n🚀 Starting ProducFlow servers...")
    
    # Start backend server
    backend_thread = start_backend_server()
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Print access information
    print_access_info()
    
    try:
        # Start frontend server (this will block)
        start_frontend_server()
    except KeyboardInterrupt:
        print("\n✓ ProducFlow stopped successfully")

if __name__ == "__main__":
    main()