import axios, { AxiosResponse } from 'axios';
import { 
  User, 
  Equipment, 
  SensorData, 
  MaintenanceAlert, 
  MaintenanceLog,
  ProductionRecord,
  ProductionMetrics,
  DashboardSummary,
  ShiftSummary,
  EquipmentCreateData,
  SensorDataCreateData,
  MaintenanceAlertCreateData 
} from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<{access_token: string, token_type: string}> => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  }
};

// Equipment API
export const equipmentAPI = {
  getEquipment: async (params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<Equipment[]> => {
    const response = await api.get('/equipment', { params });
    return response.data;
  },
  
  getEquipmentById: async (id: number): Promise<Equipment> => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },
  
  createEquipment: async (data: EquipmentCreateData): Promise<Equipment> => {
    const response = await api.post('/equipment', data);
    return response.data;
  },
  
  getSensorData: async (equipmentId: number, limit?: number): Promise<SensorData[]> => {
    const response = await api.get(`/equipment/${equipmentId}/sensors`, {
      params: { limit }
    });
    return response.data;
  },
  
  createSensorData: async (equipmentId: number, data: SensorDataCreateData): Promise<SensorData> => {
    const response = await api.post(`/equipment/${equipmentId}/sensors`, data);
    return response.data;
  }
};

// Maintenance API
export const maintenanceAPI = {
  getMaintenanceAlerts: async (params?: {
    skip?: number;
    limit?: number;
    priority?: string;
  }): Promise<MaintenanceAlert[]> => {
    const response = await api.get('/maintenance', { params });
    return response.data;
  },
  
  createMaintenanceAlert: async (data: MaintenanceAlertCreateData): Promise<MaintenanceAlert> => {
    const response = await api.post('/maintenance', data);
    return response.data;
  },
  
  getMaintenanceLogs: async (params?: {
    skip?: number;
    limit?: number;
    equipment_id?: number;
    status?: string;
  }): Promise<MaintenanceLog[]> => {
    const response = await api.get('/maintenance/logs', { params });
    return response.data;
  },
  
  updateMaintenanceLogStatus: async (
    logId: number, 
    status: string, 
    completedDate?: string
  ): Promise<void> => {
    await api.patch(`/maintenance/logs/${logId}/status`, {
      status,
      completed_date: completedDate
    });
  }
};

// Production API
export const productionAPI = {
  getProductionMetrics: async (): Promise<ProductionMetrics> => {
    const response = await api.get('/production/metrics');
    return response.data;
  },
  
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
  
  getProductionRecords: async (params?: {
    skip?: number;
    limit?: number;
    equipment_id?: number;
    shift?: string;
  }): Promise<ProductionRecord[]> => {
    const response = await api.get('/production/records', { params });
    return response.data;
  },
  
  getShiftSummary: async (date: string, shift?: string): Promise<ShiftSummary[]> => {
    const response = await api.get('/production/shifts/summary', {
      params: { date, shift }
    });
    return response.data;
  }
};

export default api;