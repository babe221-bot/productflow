import pytest
from fastapi import status

@pytest.mark.asyncio
async def test_create_equipment(client, auth_headers):
    """Test creating new equipment"""
    equipment_data = {
        "name": "Test Equipment",
        "type": "Production",
        "status": "operational",
        "location": "Factory Floor",
        "capacity": 100,
        "installation_date": "2023-01-01T00:00:00"
    }
    
    response = await client.post("/equipment", json=equipment_data, headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == equipment_data["name"]
    assert data["type"] == equipment_data["type"]
    assert data["status"] == equipment_data["status"]
    assert "id" in data

@pytest.mark.asyncio
async def test_get_equipment_list(client, auth_headers, test_equipment):
    """Test getting list of equipment"""
    response = await client.get("/equipment", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["id"] == test_equipment.id

@pytest.mark.asyncio
async def test_get_equipment_by_id(client, auth_headers, test_equipment):
    """Test getting equipment by ID"""
    response = await client.get(f"/equipment/{test_equipment.id}", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == test_equipment.id
    assert data["name"] == test_equipment.name

@pytest.mark.asyncio
async def test_get_equipment_not_found(client, auth_headers):
    """Test getting non-existent equipment"""
    response = await client.get("/equipment/99999", headers=auth_headers)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.asyncio
async def test_create_sensor_data(client, auth_headers, test_equipment):
    """Test creating sensor data"""
    sensor_data = {
        "sensor_type": "temperature",
        "value": 25.5
    }
    
    response = await client.post(
        f"/equipment/{test_equipment.id}/sensors",
        json=sensor_data,
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["sensor_type"] == sensor_data["sensor_type"]
    assert data["value"] == sensor_data["value"]
    assert data["equipment_id"] == test_equipment.id

@pytest.mark.asyncio
async def test_get_sensor_data(client, auth_headers, test_equipment):
    """Test getting sensor data for equipment"""
    # First create some sensor data
    sensor_data = {
        "sensor_type": "temperature",
        "value": 25.5
    }
    await client.post(
        f"/equipment/{test_equipment.id}/sensors",
        json=sensor_data,
        headers=auth_headers
    )
    
    # Then retrieve it
    response = await client.get(f"/equipment/{test_equipment.id}/sensors", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["sensor_type"] == sensor_data["sensor_type"]
    assert data[0]["value"] == sensor_data["value"]

@pytest.mark.asyncio
async def test_unauthorized_access(client, test_equipment):
    """Test accessing endpoints without authentication"""
    response = await client.get("/equipment")
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.asyncio
async def test_filter_equipment_by_status(client, auth_headers, test_equipment):
    """Test filtering equipment by status"""
    # Create equipment with different status
    equipment_data = {
        "name": "Maintenance Equipment",
        "type": "Production",
        "status": "maintenance",
        "location": "Factory Floor",
        "capacity": 100,
        "installation_date": "2023-01-01T00:00:00"
    }
    await client.post("/equipment", json=equipment_data, headers=auth_headers)
    
    # Filter by operational status
    response = await client.get("/equipment?status=operational", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert all(equipment["status"] == "operational" for equipment in data)
    
    # Filter by maintenance status
    response = await client.get("/equipment?status=maintenance", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert all(equipment["status"] == "maintenance" for equipment in data)