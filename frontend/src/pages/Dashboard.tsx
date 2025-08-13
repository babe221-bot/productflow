import React, { useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
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
import { formatCurrency, formatPercent, formatDateTime } from '../utils/format';
import { EQUIPMENT_STATUS } from '../constants';
import AnimatedCard from '../components/AnimatedCard';
import GlowingButton from '../components/GlowingButton';
import { animate } from 'animejs';

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
  const titleRef = useRef<HTMLElement>(null);
  const { data: summary, isLoading, error, dataUpdatedAt } = useDashboardSummary();

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      anime({
        targets: titleRef.current,
        translateY: [-30, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 1000,
        easing: 'easeOutBack',
      });
    }
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <AnimatedCard delay={i * 100}>
                <Box sx={{ p: 3 }}>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" height={50} width="80%" sx={{ my: 2 }} />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
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
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* Animated Title */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography 
          ref={titleRef}
          variant="h2" 
          sx={{
            background: 'linear-gradient(45deg, #64b5f6, #ab47bc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          Production Dashboard
        </Typography>
        
        <GlowingButton 
          variant="contained" 
          pulseAnimation
          glowColor="#64b5f6"
          startIcon={<TrendingUp />}
        >
          View Analytics
        </GlowingButton>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" sx={{ color: 'text.secondary', opacity: 0.8 }}>
          Real-time overview of your manufacturing operations
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'primary.light',
            background: 'rgba(100, 181, 246, 0.1)',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            border: '1px solid rgba(100, 181, 246, 0.3)',
          }}
        >
          Last updated: {formatDateTime(new Date(dataUpdatedAt))}
        </Typography>
      </Box>

      {/* KPI Cards with Animations */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <AnimatedCard 
              animationType={index % 2 === 0 ? 'fadeInUp' : 'scaleIn'}
              delay={index * 150}
              sx={{
                height: '100%',
                background: 'rgba(10, 25, 41, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(100, 181, 246, 0.2)',
                borderRadius: 3,
                overflow: 'visible',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(45deg, ${card.color === 'success' ? '#00e676' : 
                                                           card.color === 'warning' ? '#ff9800' : 
                                                           card.color === 'error' ? '#f44336' : '#2196f3'}, 
                                                    rgba(255,255,255,0.3))`,
                  borderRadius: '16px 16px 0 0',
                },
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  {card.icon && (
                    <Box
                      sx={{
                        mr: 2,
                        color: `${card.color}.main`,
                        background: `${card.color === 'success' ? 'rgba(0, 230, 118, 0.1)' : 
                                      card.color === 'warning' ? 'rgba(255, 152, 0, 0.1)' : 
                                      card.color === 'error' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(33, 150, 243, 0.1)'}`,
                        borderRadius: '50%',
                        p: 1,
                      }}
                    >
                      {card.icon}
                    </Box>
                  )}
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
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
                        mb={1.5}
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
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
                          <Typography variant="body2" sx={{ color: 'text.primary' }}>
                            {item.label}
                          </Typography>
                        </Box>
                        <Chip
                          label={item.value}
                          color={item.color}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: `${card.color}.main`,
                        fontWeight: 700,
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      {card.value}
                    </Typography>
                    {card.subtitle && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {card.subtitle}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>

      {/* Activity and Status Sections */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AnimatedCard animationType="slideInLeft" delay={600}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                Recent Activity
              </Typography>
              <Box>
                {[
                  { text: "Equipment health check completed for CNC Machine #2", type: "success" },
                  { text: "Maintenance alert generated for Robotic Arm #3", type: "warning" },
                  { text: "Production efficiency target achieved for Floor A", type: "success" },
                  { text: "Sensor calibration scheduled for next week", type: "info" },
                ].map((activity, index) => (
                  <Box 
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid rgba(${activity.type === 'success' ? '0, 230, 118' : 
                                                     activity.type === 'warning' ? '255, 152, 0' : 
                                                     activity.type === 'info' ? '33, 150, 243' : '255, 255, 255'}, 0.2)`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: activity.type === 'success' ? '#00e676' : 
                                   activity.type === 'warning' ? '#ff9800' : 
                                   activity.type === 'info' ? '#2196f3' : '#ffffff',
                        mr: 2,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {activity.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedCard animationType="slideInRight" delay={800}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                System Status
              </Typography>
              <Box>
                {[
                  { label: "API Status", status: "Online", color: "success" },
                  { label: "Database", status: "Connected", color: "success" },
                  { label: "Sensor Network", status: "Active", color: "success" },
                ].map((item, index) => (
                  <Box 
                    key={index}
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center"
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.03)',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {item.label}
                    </Typography>
                    <Chip 
                      label={item.status} 
                      color={item.color as any} 
                      size="small" 
                      sx={{
                        backdropFilter: 'blur(10px)',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                ))}
                <Box 
                  display="flex" 
                  justifyContent="space-between"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.03)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    Last Sync
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.light' }}>
                    {formatDateTime(new Date(dataUpdatedAt))}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </AnimatedCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;