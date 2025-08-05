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
  IconButton,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  CheckCircle,
  Warning,
  Error,
  Build,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEquipmentDetail();
    fetchSensorData();
  }, [id]);

  const fetchEquipmentDetail = async () => {
    try {
      const response = await axios.get(`/equipment/${id}`);
      setEquipment(response.data);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
      setError('Failed to load equipment details');
    }
  };

  const fetchSensorData = async () => {
    try {
      const response = await axios.get(`/equipment/${id}/sensors`);
      setSensorData(response.data);
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      setError('Failed to load sensor data');
    } finally {
      setLoading(false);
    }
  };

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

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const prepareSensorChartData = (sensorType) => {
    const filteredData = sensorData
      .filter(data => data.sensor_type === sensorType)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-20); // Last 20 readings

    return {
      labels: filteredData.map(data => 
        new Date(data.timestamp).toLocaleTimeString()
      ),
      datasets: [
        {
          label: `${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} (${filteredData[0]?.unit || ''})`,
          data: filteredData.map(data => data.value),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/equipment')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">Equipment Details</Typography>
        </Box>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/equipment')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">Equipment Details</Typography>
        </Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!equipment) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/equipment')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">Equipment Details</Typography>
        </Box>
        <Alert severity="warning">Equipment not found</Alert>
      </Box>
    );
  }

  const sensorTypes = [...new Set(sensorData.map(data => data.sensor_type))];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/equipment')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">{equipment.name}</Typography>
        </Box>
        <Box>
          <IconButton onClick={() => { fetchEquipmentDetail(); fetchSensorData(); }} color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Equipment Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Equipment Information
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  icon={getStatusIcon(equipment.status)}
                  label={equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                  color={getStatusColor(equipment.status)}
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body1">{equipment.type}</Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">{equipment.location}</Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Capacity
                </Typography>
                <Typography variant="body1">{equipment.capacity} units/hour</Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Installation Date
                </Typography>
                <Typography variant="body1">
                  {equipment.installation_date 
                    ? new Date(equipment.installation_date).toLocaleDateString()
                    : 'Not specified'
                  }
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Last Maintenance
                </Typography>
                <Typography variant="body1">
                  {equipment.last_maintenance
                    ? new Date(equipment.last_maintenance).toLocaleDateString()
                    : 'Never'
                  }
                </Typography>
              </Box>

              <Box mt={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Health Score
                  </Typography>
                  <Typography variant="h6" color={`${getHealthScoreColor(equipment.health_score)}.main`}>
                    {equipment.health_score}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={equipment.health_score}
                  color={getHealthScoreColor(equipment.health_score)}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sensor Data Charts */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {sensorTypes.map((sensorType) => (
              <Grid item xs={12} md={6} key={sensorType}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} Sensor
                    </Typography>
                    <Box sx={{ height: 250 }}>
                      <Line
                        data={prepareSensorChartData(sensorType)}
                        options={chartOptions}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Recent Sensor Readings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Sensor Readings
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', minWidth: 650 }}>
                  <Box component="thead">
                    <Box component="tr">
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Sensor Type
                      </Box>
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Value
                      </Box>
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Unit
                      </Box>
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Status
                      </Box>
                      <Box component="th" sx={{ p: 1, textAlign: 'left', fontWeight: 'bold' }}>
                        Timestamp
                      </Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {sensorData.slice(0, 10).map((data) => (
                      <Box component="tr" key={data.id}>
                        <Box component="td" sx={{ p: 1 }}>
                          {data.sensor_type.charAt(0).toUpperCase() + data.sensor_type.slice(1)}
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {data.value}
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {data.unit}
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          <Chip
                            label={data.status}
                            color={getStatusColor(data.status)}
                            size="small"
                          />
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {new Date(data.timestamp).toLocaleString()}
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

export default EquipmentDetail;