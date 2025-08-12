import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Circle,
  Wifi,
  WifiOff,
} from '@mui/icons-material';

interface SystemHealth {
  api: 'online' | 'offline';
  database: 'connected' | 'disconnected';
  sensors: 'active' | 'inactive';
}

type ConnectionStatus = 'connected' | 'disconnected' | 'warning';
type StatusColor = 'success' | 'error' | 'warning' | 'default';

const StatusIndicator: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    api: 'online',
    database: 'connected',
    sensors: 'active',
  });

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate occasional connection issues (5% chance)
      if (Math.random() < 0.05) {
        setConnectionStatus('disconnected');
        setTimeout(() => setConnectionStatus('connected'), 3000);
      }
      
      // Update system health randomly
      setSystemHealth({
        api: Math.random() > 0.1 ? 'online' : 'offline',
        database: Math.random() > 0.05 ? 'connected' : 'disconnected',
        sensors: Math.random() > 0.08 ? 'active' : 'inactive',
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string): StatusColor => {
    switch (status) {
      case 'connected':
      case 'online':
      case 'active':
        return 'success';
      case 'disconnected':
      case 'offline':
      case 'inactive':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getConnectionIcon = () => {
    return connectionStatus === 'connected' ? <Wifi /> : <WifiOff />;
  };

  const formatLastUpdate = (): string => {
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip
        title={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Circle sx={{ fontSize: 8, color: systemHealth.api === 'online' ? 'success.main' : 'error.main' }} />
                <Typography variant="caption">API: {systemHealth.api}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Circle sx={{ fontSize: 8, color: systemHealth.database === 'connected' ? 'success.main' : 'error.main' }} />
                <Typography variant="caption">Database: {systemHealth.database}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Circle sx={{ fontSize: 8, color: systemHealth.sensors === 'active' ? 'success.main' : 'error.main' }} />
                <Typography variant="caption">Sensors: {systemHealth.sensors}</Typography>
              </Box>
              <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
                Last update: {formatLastUpdate()}
              </Typography>
            </Box>
          </Box>
        }
        arrow
      >
        <Chip
          icon={getConnectionIcon()}
          label={connectionStatus === 'connected' ? 'Online' : 'Offline'}
          color={getStatusColor(connectionStatus)}
          size="small"
          variant="outlined"
          sx={{ 
            cursor: 'pointer',
            '& .MuiChip-icon': {
              fontSize: 16,
            },
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default StatusIndicator;