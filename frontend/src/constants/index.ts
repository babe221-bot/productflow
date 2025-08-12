// Application constants

export const EQUIPMENT_STATUS = {
  OPERATIONAL: 'operational',
  WARNING: 'warning',
  CRITICAL: 'critical',
  MAINTENANCE: 'maintenance',
} as const;

export const EQUIPMENT_STATUS_COLORS = {
  [EQUIPMENT_STATUS.OPERATIONAL]: '#4caf50',
  [EQUIPMENT_STATUS.WARNING]: '#ff9800',
  [EQUIPMENT_STATUS.CRITICAL]: '#f44336',
  [EQUIPMENT_STATUS.MAINTENANCE]: '#9e9e9e',
} as const;

export const SENSOR_TYPES = {
  TEMPERATURE: 'temperature',
  PRESSURE: 'pressure',
  VIBRATION: 'vibration',
  SPEED: 'speed',
} as const;

export const MAINTENANCE_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const PRIORITY_COLORS = {
  [MAINTENANCE_PRIORITIES.LOW]: '#4caf50',
  [MAINTENANCE_PRIORITIES.MEDIUM]: '#2196f3',
  [MAINTENANCE_PRIORITIES.HIGH]: '#ff9800',
  [MAINTENANCE_PRIORITIES.CRITICAL]: '#f44336',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  TECHNICIAN: 'technician',
  OPERATOR: 'operator',
} as const;

export const SHIFTS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  NIGHT: 'night',
} as const;

export const MAINTENANCE_TYPES = {
  PREVENTIVE: 'preventive',
  CORRECTIVE: 'corrective',
  EMERGENCY: 'emergency',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/token',
    ME: '/users/me',
  },
  EQUIPMENT: '/equipment',
  SENSORS: (equipmentId: number) => `/equipment/${equipmentId}/sensors`,
  MAINTENANCE: '/maintenance',
  MAINTENANCE_LOGS: '/maintenance/logs',
  PRODUCTION_METRICS: '/production/metrics',
  DASHBOARD_SUMMARY: '/dashboard/summary',
  PRODUCTION_RECORDS: '/production/records',
} as const;

export const QUERY_KEYS = {
  EQUIPMENT: 'equipment',
  SENSOR_DATA: 'sensorData',
  MAINTENANCE_ALERTS: 'maintenanceAlerts',
  MAINTENANCE_LOGS: 'maintenanceLogs',
  PRODUCTION_METRICS: 'productionMetrics',
  DASHBOARD_SUMMARY: 'dashboardSummary',
  PRODUCTION_RECORDS: 'productionRecords',
} as const;