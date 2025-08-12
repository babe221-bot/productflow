import { useQuery } from '@tanstack/react-query';
import { productionAPI, maintenanceAPI } from '../services/api';

export const useProductionMetrics = () => {
  return useQuery({
    queryKey: ['productionMetrics'],
    queryFn: productionAPI.getProductionMetrics,
    staleTime: 60000, // 1 minute
  });
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: productionAPI.getDashboardSummary,
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
};

export const useProductionRecords = (params?: {
  equipment_id?: number;
  shift?: string;
}) => {
  return useQuery({
    queryKey: ['productionRecords', params],
    queryFn: () => productionAPI.getProductionRecords(params),
    staleTime: 60000,
  });
};

export const useMaintenanceAlerts = (priority?: string) => {
  return useQuery({
    queryKey: ['maintenanceAlerts', priority],
    queryFn: () => maintenanceAPI.getMaintenanceAlerts({ priority }),
    staleTime: 60000,
  });
};

export const useMaintenanceLogs = (params?: {
  equipment_id?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['maintenanceLogs', params],
    queryFn: () => maintenanceAPI.getMaintenanceLogs(params),
    staleTime: 60000,
  });
};