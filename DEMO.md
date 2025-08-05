# ProducFlow Demo Guide

## 🚀 Quick Demo

ProducFlow is now running with sample data! Here's what you can explore:

### 🔐 Demo Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@producflow.com | admin123 | Full system access |
| **Manager** | manager@producflow.com | manager123 | Production oversight |
| **Technician** | tech@producflow.com | tech123 | Maintenance focus |

### 📊 Sample Data Overview

The system comes pre-loaded with:
- **5 Manufacturing Equipment** (CNC Machines, Robotic Arms, Conveyor Systems)
- **Real-time Sensor Data** (Temperature, Vibration, Pressure, Speed)
- **Maintenance Alerts** (Predictive and scheduled maintenance)
- **Production Records** (Output, efficiency, defect tracking)
- **User Management** (Role-based access control)

### 🎯 Key Features to Explore

#### 1. Dashboard (http://localhost:3000/dashboard)
- Real-time equipment status overview
- Production efficiency metrics
- Active maintenance alerts
- Cost savings tracking
- System health indicators

#### 2. Equipment Management (http://localhost:3000/equipment)
- Equipment health scores
- Status monitoring (Operational, Warning, Critical, Maintenance)
- Detailed equipment information
- Sensor data visualization

#### 3. Equipment Details (Click "View Details" on any equipment)
- Real-time sensor charts
- Historical data trends
- Maintenance history
- Performance metrics

#### 4. Maintenance Management (http://localhost:3000/maintenance)
- **Active Alerts Tab**: Predictive maintenance alerts with priority levels
- **Maintenance Logs Tab**: Historical maintenance records
- Priority-based filtering (Critical, High, Medium, Low)

#### 5. Analytics & Reports (http://localhost:3000/analytics)
- Production efficiency trends
- Equipment status distribution
- Output vs defects analysis
- Downtime analysis by equipment type
- Performance summary tables

#### 6. User Management (http://localhost:3000/users)
- User roles and permissions
- Department organization
- Activity status tracking
- User statistics

### 🔧 API Endpoints to Test

The backend provides a comprehensive REST API. Visit http://localhost:8000/docs for interactive documentation.

Key endpoints:
- `GET /dashboard/summary` - Dashboard metrics
- `GET /equipment` - Equipment list with filtering
- `GET /equipment/{id}` - Detailed equipment info
- `GET /equipment/{id}/sensors` - Real-time sensor data
- `GET /maintenance` - Maintenance alerts
- `GET /maintenance/logs` - Maintenance history
- `GET /production/metrics` - Production analytics

### 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material-UI Components**: Professional, consistent interface
- **Real-time Updates**: Live data refresh capabilities
- **Interactive Charts**: Powered by Chart.js
- **Role-based Navigation**: Different views based on user role
- **Dark/Light Theme Support**: Modern interface design

### 📈 Sample Scenarios to Test

1. **Equipment Monitoring**:
   - Login as Admin
   - View equipment with different status levels
   - Check sensor data trends
   - Review health scores

2. **Maintenance Management**:
   - Login as Technician
   - Review critical alerts
   - Check maintenance schedules
   - Update maintenance logs

3. **Production Analysis**:
   - Login as Manager
   - Analyze efficiency trends
   - Review defect rates
   - Monitor downtime patterns

4. **System Administration**:
   - Login as Admin
   - Manage user accounts
   - Review system statistics
   - Access all features

### 🔄 Data Refresh

The system includes sample data that simulates real manufacturing operations:
- Sensor readings update with realistic values
- Equipment status changes based on conditions
- Maintenance alerts trigger based on sensor thresholds
- Production metrics reflect operational efficiency

### 🛠️ Customization Points

For production deployment, you can:
- Connect to real sensor data sources
- Integrate with existing ERP systems
- Customize alert thresholds
- Add company-specific equipment types
- Implement custom reporting
- Configure email notifications
- Set up automated maintenance scheduling

### 📞 Support

If you encounter any issues:
1. Check that both backend (port 8000) and frontend (port 3000) are running
2. Verify database initialization completed successfully
3. Ensure all dependencies are installed
4. Check browser console for any JavaScript errors

Enjoy exploring ProducFlow! 🏭