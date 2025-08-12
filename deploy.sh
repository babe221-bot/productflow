#!/bin/bash

# ProducFlow Production Deployment Script
set -e

echo "🚀 Starting ProducFlow Production Deployment..."

# Configuration
APP_DIR="/opt/producflow"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
SERVICE_NAME="producflow-api"
NGINX_SITE="producflow"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check if required commands exist
command -v python3 >/dev/null 2>&1 || { print_error "Python3 is required but not installed."; exit 1; }
command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed."; exit 1; }

print_status "Creating application directory structure..."
sudo mkdir -p $APP_DIR
sudo mkdir -p /var/log/producflow
sudo chown -R $USER:$USER $APP_DIR
sudo chown -R www-data:www-data /var/log/producflow

print_status "Copying application files..."
cp -r . $APP_DIR/
cd $APP_DIR

print_status "Setting up Python virtual environment..."
cd $BACKEND_DIR
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements-production.txt

print_status "Setting up database..."
python init_db.py

print_status "Building frontend..."
cd $FRONTEND_DIR
npm ci --production
npm run build

print_status "Setting up systemd service..."
sudo cp $APP_DIR/producflow-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME

print_status "Setting up Nginx configuration..."
sudo cp $APP_DIR/nginx-producflow.conf /etc/nginx/sites-available/$NGINX_SITE
sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
sudo nginx -t

print_status "Setting proper permissions..."
sudo chown -R www-data:www-data $BACKEND_DIR
sudo chmod -R 755 $APP_DIR
sudo chmod 600 $BACKEND_DIR/.env.production

print_status "Starting services..."
sudo systemctl start $SERVICE_NAME
sudo systemctl reload nginx

print_status "Checking service status..."
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    print_status "✅ ProducFlow API service is running"
else
    print_error "❌ ProducFlow API service failed to start"
    sudo systemctl status $SERVICE_NAME
    exit 1
fi

if sudo systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running"
else
    print_error "❌ Nginx failed to start"
    sudo systemctl status nginx
    exit 1
fi

print_status "🎉 Deployment completed successfully!"
print_warning "Don't forget to:"
print_warning "1. Update your domain name in nginx configuration"
print_warning "2. Set up SSL certificates with Let's Encrypt"
print_warning "3. Update CORS_ORIGINS in .env.production"
print_warning "4. Set up database backups"
print_warning "5. Configure monitoring and logging"

echo ""
print_status "Service URLs:"
echo "  Frontend: https://your-domain.com"
echo "  API: https://your-domain.com/api/"
echo "  Health Check: https://your-domain.com/health"

echo ""
print_status "Useful commands:"
echo "  Check API status: sudo systemctl status $SERVICE_NAME"
echo "  View API logs: sudo journalctl -u $SERVICE_NAME -f"
echo "  Restart API: sudo systemctl restart $SERVICE_NAME"
echo "  Check Nginx: sudo nginx -t && sudo systemctl reload nginx"