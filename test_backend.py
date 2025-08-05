#!/usr/bin/env python3
"""
Simple test script to verify the ProducFlow backend is working
"""

import requests
import json

def test_backend():
    """Test the backend API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing ProducFlow Backend API")
    print("=" * 40)
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/docs")
        if response.status_code == 200:
            print("✓ Backend server is running")
        else:
            print(f"❌ Server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
        print("Make sure the server is running with: python -m uvicorn main:app --reload")
        return False
    
    # Test 2: Try to login with demo credentials
    try:
        login_data = {
            "username": "admin@producflow.com",
            "password": "admin123"
        }
        response = requests.post(f"{base_url}/token", data=login_data)
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get("access_token")
            print("✓ Authentication working")
            
            # Test 3: Try to access protected endpoint
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{base_url}/dashboard/summary", headers=headers)
            if response.status_code == 200:
                summary = response.json()
                print("✓ Dashboard API working")
                print(f"  - Equipment operational: {summary.get('equipment_operational', 0)}")
                print(f"  - Production efficiency: {summary.get('production_efficiency', 0)}%")
                print(f"  - Active alerts: {summary.get('active_alerts', 0)}")
            else:
                print(f"❌ Dashboard API failed with status {response.status_code}")
                return False
                
            # Test 4: Try to get equipment list
            response = requests.get(f"{base_url}/equipment", headers=headers)
            if response.status_code == 200:
                equipment = response.json()
                print(f"✓ Equipment API working ({len(equipment)} equipment found)")
            else:
                print(f"❌ Equipment API failed with status {response.status_code}")
                return False
                
        else:
            print(f"❌ Authentication failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False
    
    print("\n🎉 All backend tests passed!")
    print("\nNext steps:")
    print("1. Install Node.js and npm if not already installed")
    print("2. Navigate to the frontend directory: cd frontend")
    print("3. Install dependencies: npm install")
    print("4. Start the frontend: npm start")
    print("5. Open http://localhost:3000 in your browser")
    
    return True

if __name__ == "__main__":
    test_backend()