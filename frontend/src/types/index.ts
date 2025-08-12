export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'technician' | 'operator';
  department: string;
  is_active: boolean;
  created_at: string;
}

export interface Equipment {
  id: number;
  name: string;
  type: string;
  status: 'operational' | 'warning' | 'critical' | 'maintenance';
  location: string;
  capacity: number;
  health_score: number;
  last_maintenance: string | null;
  installation_date: string;
  created_at: string;
  updated_at: string | null;
}

export interface SensorData {
  id: number;
  equipment_id: number;
  sensor_type: 'temperature' | 'pressure' | 'vibration' | 'speed';
  value: number;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
  equipment?: Equipment;
}

export interface MaintenanceAlert {
  id: number;
  equipment_id: number;
  alert_type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  predicted_date: string;
  confidence: number;
  status: string;
  created_at: string;
  equipment?: Equipment;
}

export interface MaintenanceLog {
  id: number;
  equipment_id: number;
  technician_id: number;
  maintenance_type: 'preventive' | 'corrective' | 'emergency';
  description: string;
  start_date: string;
  completion_date: string | null;
  cost: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  equipment?: Equipment;
  technician?: User;
}

export interface ProductionRecord {
  id: number;
  equipment_id: number;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  output: number;
  defects: number;
  efficiency_percentage: number;
  downtime_minutes: number;
  equipment?: Equipment;
}

export interface ProductionMetrics {
  total_output: number;
  efficiency_percentage: number;
  defect_rate: number;
  total_downtime_hours: number;
  active_equipment_count: number;
}

export interface DashboardSummary {
  total_equipment: number;
  operational_equipment: number;
  warning_equipment: number;
  critical_equipment: number;
  maintenance_equipment: number;
  active_alerts: number;
  production_efficiency: number;
  cost_savings: number;
}

export interface ShiftSummary {
  shift: string;
  date: string;
  total_output: number;
  efficiency_percentage: number;
  equipment_count: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface EquipmentCreateData {
  name: string;
  type: string;
  location: string;
  capacity: number;
  installation_date: string;
}

export interface SensorDataCreateData {
  sensor_type: 'temperature' | 'pressure' | 'vibration' | 'speed';
  value: number;
}

export interface MaintenanceAlertCreateData {
  alert_type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  predicted_date: string;
  confidence: number;
}