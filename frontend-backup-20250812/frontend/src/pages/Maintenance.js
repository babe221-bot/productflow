import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  MenuItem,
  LinearProgress,
  Alert,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  Refresh,
  Add,
} from '@mui/icons-material';
import axios from 'axios';

const Maintenance = () => {
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchMaintenanceData();
  }, [priorityFilter]);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      const alertParams = priorityFilter ? { priority: priorityFilter } : {};
      const [alertsResponse, logsResponse] = await Promise.all([
        axios.get('/maintenance', { params: alertParams }),
        axios.get('/maintenance/logs')
      ]);
      setAlerts(alertsResponse.data);
      setLogs(logsResponse.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch maintenance data:', error);
      setError('Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <Error />;
      case 'high':
        return <Warning />;
      case 'medium':
        return <Info />;
      case 'low':
        return <CheckCircle />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Maintenance Management
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Maintenance Management</Typography>
        <IconButton onClick={fetchMaintenanceData} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Active Alerts" />
          <Tab label="Maintenance Logs" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Active Alerts Tab */}
      {tabValue === 0 && (
        <Box>
          <Box display="flex" gap={2} mb={3}>
            <TextField
              select
              label="Filter by Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
          </Box>

          <Grid container spacing={3}>
            {alerts.map((alert) => (
              <Grid item xs={12} md={6} lg={4} key={alert.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" component="div">
                        {alert.title}
                      </Typography>
                      <Chip
                        icon={getPriorityIcon(alert.priority)}
                        label={alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                        color={getPriorityColor(alert.priority)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Type: {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </Typography>

                    <Typography variant="body2" paragraph>
                      {alert.description}
                    </Typography>

                    {alert.predicted_date && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Predicted Date: {new Date(alert.predicted_date).toLocaleDateString()}
                      </Typography>
                    )}

                    {alert.confidence && (
                      <Box mt={2} mb={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2">Confidence</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {Math.round(alert.confidence * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={alert.confidence * 100}
                          color={alert.confidence > 0.8 ? 'success' : 'warning'}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(alert.created_at).toLocaleDateString()}
                    </Typography>

                    <Box mt={2}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                      >
                        Acknowledge
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {alerts.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No maintenance alerts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {priorityFilter ? 'Try changing the filter criteria' : 'All equipment is running smoothly'}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Maintenance Logs Tab */}
      {tabValue === 1 && (
        <Box>
          <Box display="flex" justify="flex-end" mb={3}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {/* TODO: Open create maintenance log dialog */}}
            >
              New Maintenance Log
            </Button>
          </Box>

          <Grid container spacing={3}>
            {logs.map((log) => (
              <Grid item xs={12} md={6} key={log.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" component="div">
                        {log.maintenance_type.charAt(0).toUpperCase() + log.maintenance_type.slice(1)} Maintenance
                      </Typography>
                      <Chip
                        label={log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        color={getStatusColor(log.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" paragraph>
                      {log.description}
                    </Typography>

                    {log.cost && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Cost: ${log.cost.toLocaleString()}
                      </Typography>
                    )}

                    {log.duration_hours && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Duration: {log.duration_hours} hours
                      </Typography>
                    )}

                    {log.parts_replaced && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Parts Replaced: {log.parts_replaced}
                      </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Scheduled: {log.scheduled_date 
                        ? new Date(log.scheduled_date).toLocaleDateString()
                        : 'Not scheduled'
                      }
                    </Typography>

                    {log.completed_date && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Completed: {new Date(log.completed_date).toLocaleDateString()}
                      </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(log.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {logs.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No maintenance logs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No maintenance activities have been logged yet
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Maintenance;