import pytest
from fastapi import status
from app import auth

def test_verify_password():
    """Test password verification"""
    plain_password = "testpassword"
    hashed_password = auth.get_password_hash(plain_password)
    
    # Verify correct password
    assert auth.verify_password(plain_password, hashed_password) is True
    
    # Verify incorrect password
    assert auth.verify_password("wrongpassword", hashed_password) is False

def test_create_access_token():
    """Test JWT token creation"""
    data = {"sub": "test@example.com"}
    token = auth.create_access_token(data)
    
    # Token should be a string
    assert isinstance(token, str)
    
    # Token should contain three parts (header.payload.signature)
    assert len(token.split('.')) == 3

@pytest.mark.asyncio
async def test_authenticate_user(db_session, test_user):
    """Test user authentication"""
    # Test with correct credentials
    user = await auth.authenticate_user(db_session, test_user.email, "secret")
    assert user is not None
    assert user.email == test_user.email
    
    # Test with wrong password
    user = await auth.authenticate_user(db_session, test_user.email, "wrongpassword")
    assert user is None
    
    # Test with non-existent user
    user = await auth.authenticate_user(db_session, "nonexistent@example.com", "password")
    assert user is None

@pytest.mark.asyncio
async def test_get_current_user(client, test_user, auth_headers):
    """Test getting current user from token"""
    response = await client.get("/users/me", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == test_user.email
    assert data["full_name"] == test_user.full_name

@pytest.mark.asyncio
async def test_login_for_access_token(client, test_user):
    """Test login endpoint"""
    # Test with correct credentials
    response = await client.post(
        "/token",
        data={"username": test_user.email, "password": "secret"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    
    # Test with wrong credentials
    response = await client.post(
        "/token",
        data={"username": test_user.email, "password": "wrongpassword"}
    )
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.asyncio
async def test_protected_endpoint_without_token(client):
    """Test accessing protected endpoint without authentication"""
    response = await client.get("/users/me")
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED