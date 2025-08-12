import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup,
  Button,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Assessment,
  Factory,
  Speed,
  Thermostat,
  Timeline,
} from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useProductionMetrics } from '../hooks/useProduction';
import { formatPercent, formatNumber } from '../utils/format';
import LoadingSpinner from '../components/LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type TimeRange = '24h' | '7d' | '30d' | '90d';
type MetricType = 'production' | 'efficiency' | 'maintenance' | 'quality';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('production');
  
  const { data: metrics, isLoading, error } = useProductionMetrics();

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  // Mock data for charts - in real implementation, this would come from the API
  const productionChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Production Volume',
        data: [12000, 19000, 15000, 22000, 18000, 25000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Target',
        data: [15000, 15000, 15000, 15000, 15000, 15000],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderDash: [5, 5],
      },
    ],
  };

  const efficiencyChartData = {
    labels: ['Line A', 'Line B', 'Line C', 'Line D', 'Line E'],
    datasets: [
      {
        label: 'Efficiency (%)',
        data: [87, 92, 78, 95, 89],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  const equipmentStatusData = {
    labels: ['Operational', 'Warning', 'Critical', 'Maintenance'],
    datasets: [
      {
        data: [45, 12, 3, 8],
        backgroundColor: [
          '#4caf50',
          '#ff9800',
          '#f44336',
          '#9e9e9e',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Analytics
        </Typography>
        <Typography color="error">
          Failed to load analytics data. Please try again.
        </Typography>
      </Box>
    );
  }

  const kpiMetrics = [
    {
      title: 'Overall Equipment Effectiveness',
      value: formatPercent(87.5),
      change: '+2.3%',
      trend: 'up',
      icon: <Factory />,
      color: 'success',
    },
    {
      title: 'Production Efficiency',
      value: formatPercent(92.1),
      change: '+5.1%',
      trend: 'up',
      icon: <TrendingUp />,
      color: 'success',
    },
    {
      title: 'Quality Rate',
      value: formatPercent(98.7),
      change: '-0.2%',
      trend: 'down',
      icon: <Assessment />,
      color: 'warning',
    },
    {
      title: 'Downtime Hours',
      value: '12.5',
      change: '-15.3%',
      trend: 'down',
      icon: <Timeline />,
      color: 'success',
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Analytics & Insights</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              label="Time Range"
            >
              {timeRangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" color={`${metric.color}.main`}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Chip
                        label={metric.change}
                        size="small"
                        color={metric.trend === 'up' ? 'success' : 'warning'}
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ color: `${metric.color}.main` }}>
                    {metric.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Metric Selection */}
      <Box mb={3}>
        <ButtonGroup variant="outlined" aria-label="metric selection">
          <Button
            variant={selectedMetric === 'production' ? 'contained' : 'outlined'}
            onClick={() => setSelectedMetric('production')}
            startIcon={<Factory />}
          >
            Production
          </Button>
          <Button
            variant={selectedMetric === 'efficiency' ? 'contained' : 'outlined'}
            onClick={() => setSelectedMetric('efficiency')}
            startIcon={<Speed />}
          >
            Efficiency
          </Button>
          <Button
            variant={selectedMetric === 'maintenance' ? 'contained' : 'outlined'}
            onClick={() => setSelectedMetric('maintenance')}
            startIcon={<Thermostat />}
          >
            Equipment Status
          </Button>
          <Button
            variant={selectedMetric === 'quality' ? 'contained' : 'outlined'}
            onClick={() => setSelectedMetric('quality')}
            startIcon={<Assessment />}
          >
            Quality
          </Button>
        </ButtonGroup>
      </Box>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Main Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedMetric === 'production' && 'Production Volume Trend'}
                {selectedMetric === 'efficiency' && 'Efficiency by Production Line'}
                {selectedMetric === 'maintenance' && 'Equipment Status Distribution'}
                {selectedMetric === 'quality' && 'Quality Metrics Over Time'}
              </Typography>
              <Box height={400}>
                {selectedMetric === 'production' && (
                  <Line data={productionChartData} options={chartOptions} />
                )}
                {selectedMetric === 'efficiency' && (
                  <Bar data={efficiencyChartData} options={chartOptions} />
                )}
                {selectedMetric === 'maintenance' && (
                  <Doughnut data={equipmentStatusData} options={doughnutOptions} />
                )}
                {selectedMetric === 'quality' && (
                  <Line data={productionChartData} options={chartOptions} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Side Panel */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Summary
                  </Typography>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body2">Production Target</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatNumber(125000)} units
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body2">Actual Production</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {formatNumber(131250)} units
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body2">Efficiency</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {formatPercent(105)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Cost Savings</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        $25,340
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Performing Assets
                  </Typography>
                  <Box>
                    {[
                      { name: 'CNC Machine #1', efficiency: 98.5 },
                      { name: 'Robotic Arm #3', efficiency: 97.2 },
                      { name: 'Assembly Line A', efficiency: 96.8 },
                      { name: 'Quality Station #2', efficiency: 95.9 },
                    ].map((asset, index) => (
                      <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{asset.name}</Typography>
                        <Chip
                          label={formatPercent(asset.efficiency)}
                          size="small"
                          color="success"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;