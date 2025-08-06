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
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Warning,
  Error,
  Build,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipment();
  }, [statusFilter]);

  useEffect(() => {
    filterEquipment();
  }, [equipment, searchQuery, statusFilter]);

  const filterEquipment = () => {
    let filtered = equipment;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredEquipment(filtered);
  };

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await axios.get('/equipment', { params });
      setEquipment(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
      setError('Failed to load equipment data');
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

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Equipment Management
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Equipment Management</Typography>
        <IconButton onClick={fetchEquipment} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <SearchBar
          placeholder="Search equipment by name, type, or location..."
          onSearch={setSearchQuery}
          value={searchQuery}
          suggestions={equipment.map(item => item.name)}
          filters={[
            { label: 'Operational', value: 'operational' },
            { label: 'Warning', value: 'warning' },
            { label: 'Critical', value: 'critical' },
            { label: 'Maintenance', value: 'maintenance' },
          ]}
          onFilterChange={(filters) => setStatusFilter(filters[0] || '')}
          fullWidth
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {equipment.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(item.status)}
                    label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type: {item.type}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location: {item.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Capacity: {item.capacity} units/hour
                </Typography>

                <Box mt={2} mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Health Score</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.health_score}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.health_score}
                    color={getHealthScoreColor(item.health_score)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last Maintenance: {
                    item.last_maintenance
                      ? new Date(item.last_maintenance).toLocaleDateString()
                      : 'Never'
                  }
                </Typography>

                <Box mt={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/equipment/${item.id}`)}
                    fullWidth
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {equipment.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No equipment found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {statusFilter ? 'Try changing the filter criteria' : 'No equipment has been added yet'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Equipment;