# ProducFlow Deployment Guide

## 🚀 Quick Start (Development)

### Option 1: Automated Setup (Recommended)
```bash
# Clone and start everything
git clone <repository-url>
cd producflow
python start_producflow.py
```

### Option 2: Manual Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
python init_db.py
python -m uvicorn main:app --reload

# Frontend (in new terminal)
cd frontend
npm install
npm start
```

## 🏭 Production Deployment

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (recommended for production)
- Nginx (for reverse proxy)
- SSL certificate

### 1. Environment Setup

#### Backend Environment (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost/producflow

# Security
SECRET_KEY=your-super-secure-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# CORS
CORS_ORIGINS=["https://your-domain.com"]

# Environment
ENVIRONMENT=production
```

#### Frontend Environment (.env)
```env
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_ENVIRONMENT=production
```

### 2. Database Setup

#### PostgreSQL Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb producflow
sudo -u postgres createuser producflow_user
sudo -u postgres psql -c "ALTER USER producflow_user PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE producflow TO producflow_user;"
```

#### Database Migration
```bash
cd backend
python init_db.py  # Initialize with sample data
# Or use Alembic for migrations in production
```

### 3. Backend Deployment

#### Using Gunicorn (Recommended)
```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Systemd Service (Linux)
Create `/etc/systemd/system/producflow-api.service`:
```ini
[Unit]
Description=ProducFlow API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/producflow/backend
Environment=PATH=/path/to/venv/bin
ExecStart=/path/to/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable producflow-api
sudo systemctl start producflow-api
```

### 4. Frontend Deployment

#### Build for Production
```bash
cd frontend
npm run build
```

#### Nginx Configuration
Create `/etc/nginx/sites-available/producflow`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    # Frontend
    location / {
        root /path/to/producflow/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support (if needed)
    location /ws/ {
        proxy_pass http://localhost:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/producflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. Monitoring & Logging

#### Application Monitoring
```bash
# Install monitoring tools
pip install prometheus-client
pip install sentry-sdk[fastapi]
```

#### Log Configuration
```python
# In main.py
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/producflow/app.log'),
        logging.StreamHandler()
    ]
)
```

### 7. Backup Strategy

#### Database Backup
```bash
# Daily backup script
#!/bin/bash
pg_dump -h localhost -U producflow_user producflow > /backups/producflow_$(date +%Y%m%d).sql
find /backups -name "producflow_*.sql" -mtime +7 -delete
```

#### File Backup
```bash
# Backup application files
rsync -av /path/to/producflow/ /backups/app/
```

## 🔒 Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secret key
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Implement backup strategy
- [ ] Set up monitoring alerts

## 📊 Performance Optimization

### Database
- [ ] Add database indexes
- [ ] Configure connection pooling
- [ ] Set up read replicas
- [ ] Implement caching (Redis)

### API
- [ ] Enable gzip compression
- [ ] Implement response caching
- [ ] Add request rate limiting
- [ ] Monitor API performance

### Frontend
- [ ] Enable CDN for static assets
- [ ] Implement code splitting
- [ ] Optimize bundle size
- [ ] Enable service worker

## 🚨 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check dependencies
pip list | grep fastapi

# Check database connection
python -c "from app.database import engine; print('DB OK')"

# Check logs
tail -f /var/log/producflow/app.log
```

#### Frontend build fails
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 16+
```

#### Database connection issues
```bash
# Test connection
psql -h localhost -U producflow_user -d producflow

# Check service status
sudo systemctl status postgresql
```

## 📞 Support

For deployment issues:
1. Check logs first
2. Verify all services are running
3. Test API endpoints manually
4. Check network connectivity
5. Review configuration files

## 🐳 Docker Deployment (Alternative)

### Quick Docker Deployment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your production values
nano .env

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Docker Commands
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update and rebuild
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 🚀 Automated Deployment

### Using the Deployment Script
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The deployment script will:
- Set up directory structure
- Install dependencies
- Build frontend
- Configure services
- Start everything

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Update domain name in nginx configuration
- [ ] Generate strong SECRET_KEY
- [ ] Configure CORS_ORIGINS with your domain
- [ ] Set up SSL certificates
- [ ] Configure database (PostgreSQL recommended)
- [ ] Set up monitoring and logging
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Set up firewall rules
- [ ] Configure rate limiting

**ProducFlow is ready for production deployment!** 🏭