#!/usr/bin/env python3
"""
Startup script for ProducFlow frontend
"""

import subprocess
import sys
import os
from pathlib import Path
import shutil

def check_node_version():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✓ Node.js {version} detected")
        else:
            raise FileNotFoundError
    except FileNotFoundError:
        print("Error: Node.js is not installed or not in PATH")
        print("Please install Node.js from https://nodejs.org/")
        sys.exit(1)

def check_npm():
    """Check if npm is available"""
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✓ npm {version} detected")
        else:
            raise FileNotFoundError
    except FileNotFoundError:
        print("Error: npm is not installed or not in PATH")
        sys.exit(1)

def install_dependencies():
    """Install required dependencies"""
    print("Installing frontend dependencies...")
    try:
        os.chdir("frontend")
        subprocess.check_call(["npm", "install"])
        print("✓ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("Error: Failed to install dependencies")
        sys.exit(1)

def start_development_server():
    """Start the React development server"""
    print("Starting ProducFlow frontend development server...")
    print("Application will be available at: http://localhost:3000")
    print("Press Ctrl+C to stop the server")
    
    try:
        subprocess.check_call(["npm", "start"])
    except KeyboardInterrupt:
        print("\n✓ Development server stopped")
    except subprocess.CalledProcessError:
        print("Error: Failed to start development server")
        sys.exit(1)

def main():
    """Main startup function"""
    print("🖥️  ProducFlow Frontend Startup")
    print("=" * 40)
    
    # Change to project root directory
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    check_node_version()
    check_npm()
    install_dependencies()
    start_development_server()

if __name__ == "__main__":
    main()