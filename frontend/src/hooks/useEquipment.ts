import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentAPI } from '../services/api';
import { Equipment, EquipmentCreateData, SensorData, SensorDataCreateData } from '../types';

// Equipment queries
export const useEquipment = (status?: string) => {
  return useQuery({
    queryKey: ['equipment', status],
    queryFn: () => equipmentAPI.getEquipment({ status }),
    staleTime: 30000, // 30 seconds
  });
};

export const useEquipmentById = (id: number) => {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: () => equipmentAPI.getEquipmentById(id),
    enabled: !!id,
  });
};

export const useSensorData = (equipmentId: number, limit: number = 20) => {
  return useQuery({
    queryKey: ['sensorData', equipmentId, limit],
    queryFn: () => equipmentAPI.getSensorData(equipmentId, limit),
    enabled: !!equipmentId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
  });
};

// Equipment mutations
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EquipmentCreateData) => equipmentAPI.createEquipment(data),
    onSuccess: () => {
      // Invalidate and refetch equipment list
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
};

export const useCreateSensorData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ equipmentId, data }: { equipmentId: number; data: SensorDataCreateData }) => 
      equipmentAPI.createSensorData(equipmentId, data),
    onSuccess: (_, variables) => {
      // Invalidate sensor data for this equipment
      queryClient.invalidateQueries({ 
        queryKey: ['sensorData', variables.equipmentId] 
      });
    },
  });
};