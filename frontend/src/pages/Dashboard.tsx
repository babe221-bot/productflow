import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  CheckCircle,
  Error,
  Build,
  AttachMoney,
} from '@mui/icons-material';
import { useDashboardSummary } from '../hooks/useProduction';
import { DashboardSummary } from '../types';
import { formatCurrency, formatPercent, formatDateTime } from '../utils/format';
import { EQUIPMENT_STATUS } from '../constants';

interface KPIItem {
  label: string;
  value: number | string;
  color: 'success' | 'warning' | 'error' | 'info';
  icon: React.ReactNode;
}

interface KPICard {
  title: string;
  icon?: React.ReactNode;
  color: 'success' | 'warning' | 'error' | 'info';
  value?: string | number;
  subtitle?: string;
  items?: KPIItem[];
}

const Dashboard: React.FC = () => {
  const { data: summary, isLoading, error, dataUpdatedAt } = useDashboardSummary();

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" height={40} width="80%" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Alert severity="error">
          Failed to load dashboard data. Please try refreshing the page.
        </Alert>
      </Box>
    );
  }

  if (!summary) return null;

  const kpiCards: KPICard[] = [
    {
      title: 'Equipment Status',
      items: [
        {
          label: 'Operational',
          value: summary.operational_equipment,
          color: 'success',
          icon: <CheckCircle />,
        },
        {
          label: 'Warning',
          value: summary.warning_equipment,
          color: 'warning',
          icon: <Warning />,
        },
        {
          label: 'Critical',
          value: summary.critical_equipment,
          color: 'error',
          icon: <Error />,
        },
        {
          label: 'Maintenance',
          value: summary.maintenance_equipment,
          color: 'info',
          icon: <Build />,
        },
      ],
      color: 'success',
    },
    {
      title: 'Production Efficiency',
      value: formatPercent(summary.production_efficiency),
      icon: <TrendingUp />,
      color: summary.production_efficiency >= 90 ? 'success' : 'warning',
      subtitle: summary.production_efficiency >= 90 ? 'Above target threshold' : 'Below target',
    },
    {
      title: 'Active Alerts',
      value: summary.active_alerts,
      icon: <Warning />,
      color: summary.active_alerts > 0 ? 'warning' : 'success',
      subtitle: summary.active_alerts > 0 ? 'Requiring attention' : 'All clear',
    },
    {
      title: 'Cost Savings',
      value: formatCurrency(summary.cost_savings),
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
          Last updated: {formatDateTime(new Date(dataUpdatedAt))}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {kpiCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', position: 'relative' }}>
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
                  <Typography variant="body2">Last Sync</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(new Date(dataUpdatedAt))}
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