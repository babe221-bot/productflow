#!/usr/bin/env python3
"""
Script to generate API documentation
"""
import json
import os
from main import app

def generate_openapi_spec():
    """Generate OpenAPI specification"""
    spec = app.openapi()
    
    # Add custom documentation
    spec["info"]["description"] = """
    # ProducFlow API Documentation
    
    ProducFlow is a comprehensive manufacturing management system that provides real-time monitoring, 
    predictive maintenance, and production analytics for industrial equipment.
    
    ## Authentication
    
    All API endpoints (except `/token` and `/health`) require authentication using JWT tokens. 
    To authenticate:
    
    1. Obtain a token by sending a POST request to `/token` with username and password
    2. Include the token in the Authorization header: `Authorization: Bearer <token>`
    
    ## Base URL
    
    - Development: `http://localhost:8000`
    - Production: `https://api.producflow.com`
    
    ## Rate Limiting
    
    API requests are rate limited to 100 requests per minute per authenticated user.
    """
    
    # Save to file
    with open('api-spec.json', 'w') as f:
        json.dump(spec, f, indent=2)
    
    print("OpenAPI specification generated successfully: api-spec.json")

if __name__ == "__main__":
    generate_openapi_spec()