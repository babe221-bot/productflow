import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Build,
  AttachMoney,
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time data updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/dashboard/summary');
      setSummary(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      case 'maintenance':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'critical':
        return <Error />;
      case 'maintenance':
        return <Build />;
      default:
        return null;
    }
  };

  const kpiCards = [
    {
      title: 'Equipment Status',
      items: [
        {
          label: 'Operational',
          value: summary?.equipment_operational || 0,
          color: 'success',
          icon: <CheckCircle />,
        },
        {
          label: 'Warning',
          value: summary?.equipment_warning || 0,
          color: 'warning',
          icon: <Warning />,
        },
        {
          label: 'Critical',
          value: summary?.equipment_critical || 0,
          color: 'error',
          icon: <Error />,
        },
        {
          label: 'Maintenance',
          value: summary?.equipment_maintenance || 0,
          color: 'info',
          icon: <Build />,
        },
      ],
    },
    {
      title: 'Production Efficiency',
      value: `${summary?.production_efficiency || 0}%`,
      icon: <TrendingUp />,
      color: summary?.production_efficiency >= 90 ? 'success' : 'warning',
      subtitle: 'Above target threshold',
    },
    {
      title: 'Active Alerts',
      value: summary?.active_alerts || 0,
      icon: <Warning />,
      color: summary?.active_alerts > 0 ? 'warning' : 'success',
      subtitle: 'Requiring attention',
    },
    {
      title: 'Cost Savings',
      value: `$${(summary?.cost_savings || 0).toLocaleString()}`,
      icon: <AttachMoney />,
      color: 'success',
      subtitle: 'This month',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" color="text.secondary">
          Real-time overview of your manufacturing operations
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {kpiCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {card.icon && (
                    <Box
                      sx={{
                        mr: 2,
                        color: `${card.color}.main`,
                      }}
                    >
                      {card.icon}
                    </Box>
                  )}
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                </Box>

                {card.items ? (
                  <Box>
                    {card.items.map((item, itemIndex) => (
                      <Box
                        key={itemIndex}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              mr: 1,
                              color: `${item.color}.main`,
                              fontSize: '1rem',
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Typography variant="body2">{item.label}</Typography>
                        </Box>
                        <Chip
                          label={item.value}
                          color={item.color}
                          size="small"
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h4" color={`${card.color}.main`}>
                      {card.value}
                    </Typography>
                    {card.subtitle && (
                      <Typography variant="body2" color="text.secondary">
                        {card.subtitle}
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  • Equipment health check completed for CNC Machine #2
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Maintenance alert generated for Robotic Arm #3
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Production efficiency target achieved for Floor A
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Sensor calibration scheduled for next week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">API Status</Typography>
                  <Chip label="Online" color="success" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Database</Typography>
                  <Chip label="Connected" color="success" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Sensor Network</Typography>
                  <Chip label="Active" color="success" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Last Update</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;