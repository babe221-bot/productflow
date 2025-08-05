import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
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
import axios from 'axios';

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

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [metricsResponse, equipmentResponse] = await Promise.all([
        axios.get('/production/metrics'),
        axios.get('/equipment')
      ]);
      setMetrics(metricsResponse.data);
      setEquipment(equipmentResponse.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts - in real implementation, this would come from the API
  const efficiencyTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Production Efficiency (%)',
        data: [88, 92, 89, 94, 91, 87, 93],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const outputData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Output (Units)',
        data: [2800, 3200, 2950, 3400],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
      {
        label: 'Defects',
        data: [45, 38, 52, 41],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
    ],
  };

  const equipmentStatusData = {
    labels: ['Operational', 'Warning', 'Critical', 'Maintenance'],
    datasets: [
      {
        data: [
          equipment.filter(e => e.status === 'operational').length,
          equipment.filter(e => e.status === 'warning').length,
          equipment.filter(e => e.status === 'critical').length,
          equipment.filter(e => e.status === 'maintenance').length,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const downtimeData = {
    labels: ['Molding', 'Milling', 'Assembly', 'Transport', 'Inspection'],
    datasets: [
      {
        label: 'Downtime (Hours)',
        data: [2.5, 4.2, 1.8, 0.5, 1.2],
        backgroundColor: 'rgba(255, 159, 64, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Analytics & Reports
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Analytics & Reports</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            select
            label="Time Range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
          </TextField>
          <IconButton onClick={fetchAnalyticsData} color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Output
              </Typography>
              <Typography variant="h4" color="primary">
                {metrics?.total_output?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Units produced
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Efficiency
              </Typography>
              <Typography variant="h4" color="success.main">
                {metrics?.efficiency_percentage || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Production efficiency
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Defect Rate
              </Typography>
              <Typography variant="h4" color="warning.main">
                {metrics?.defect_rate || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quality metric
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Downtime
              </Typography>
              <Typography variant="h4" color="error.main">
                {metrics?.downtime_hours || 0}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total downtime
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Production Efficiency Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={efficiencyTrendData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Equipment Status Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut data={equipmentStatusData} options={doughnutOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Output vs Defects (Weekly)
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={outputData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Downtime by Equipment Type
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={downtimeData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Summary Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Equipment Performance Summary
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', minWidth: 650 }}>
                  <Box component="thead">
                    <Box component="tr">
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Equipment
                      </Box>
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Type
                      </Box>
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Status
                      </Box>
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Health Score
                      </Box>
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Efficiency
                      </Box>
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Last Maintenance
                      </Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {equipment.map((item) => (
                      <Box component="tr" key={item.id}>
                        <Box component="td" sx={{ p: 1 }}>
                          {item.name}
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {item.type}
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          <Typography
                            variant="body2"
                            color={
                              item.status === 'operational' ? 'success.main' :
                              item.status === 'warning' ? 'warning.main' :
                              item.status === 'critical' ? 'error.main' : 'info.main'
                            }
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Typography>
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {item.health_score}%
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {Math.round(85 + Math.random() * 15)}%
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {item.last_maintenance
                            ? new Date(item.last_maintenance).toLocaleDateString()
                            : 'Never'
                          }
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;