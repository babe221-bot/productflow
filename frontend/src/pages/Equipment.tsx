import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Chip,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Refresh,
  Engineering,
  Speed,
  Thermostat,
  Warning,
  CheckCircle,
  Error,
  Build,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEquipment, useCreateEquipment } from '../hooks/useEquipment';
import { Equipment as EquipmentType, EquipmentCreateData } from '../types';
import { formatDateTime } from '../utils/format';
import { EQUIPMENT_STATUS, EQUIPMENT_STATUS_COLORS } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';

const Equipment: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [newEquipment, setNewEquipment] = useState<EquipmentCreateData>({
    name: '',
    type: '',
    location: '',
    status: EQUIPMENT_STATUS.OPERATIONAL,
  });
  
  const navigate = useNavigate();
  
  const { 
    data: equipment = [], 
    isLoading, 
    error, 
    refetch 
  } = useEquipment(statusFilter || undefined);
  
  const createEquipmentMutation = useCreateEquipment();

  const getStatusColor = (status: string) => {
    switch (status) {
      case EQUIPMENT_STATUS.OPERATIONAL:
        return 'success';
      case EQUIPMENT_STATUS.WARNING:
        return 'warning';
      case EQUIPMENT_STATUS.CRITICAL:
        return 'error';
      case EQUIPMENT_STATUS.MAINTENANCE:
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case EQUIPMENT_STATUS.OPERATIONAL:
        return <CheckCircle />;
      case EQUIPMENT_STATUS.WARNING:
        return <Warning />;
      case EQUIPMENT_STATUS.CRITICAL:
        return <Error />;
      case EQUIPMENT_STATUS.MAINTENANCE:
        return <Build />;
      default:
        return <Engineering />;
    }
  };

  const filteredEquipment = equipment.filter((item: EquipmentType) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateEquipment = async () => {
    try {
      await createEquipmentMutation.mutateAsync(newEquipment);
      setIsCreateDialogOpen(false);
      setNewEquipment({
        name: '',
        type: '',
        location: '',
        status: EQUIPMENT_STATUS.OPERATIONAL,
      });
    } catch (error) {
      console.error('Failed to create equipment:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading equipment..." />;
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Equipment
        </Typography>
        <Typography color="error">
          Failed to load equipment. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Equipment Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add Equipment
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value={EQUIPMENT_STATUS.OPERATIONAL}>Operational</MenuItem>
                  <MenuItem value={EQUIPMENT_STATUS.WARNING}>Warning</MenuItem>
                  <MenuItem value={EQUIPMENT_STATUS.CRITICAL}>Critical</MenuItem>
                  <MenuItem value={EQUIPMENT_STATUS.MAINTENANCE}>Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => refetch()}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <Grid container spacing={3}>
        {filteredEquipment.map((item: EquipmentType) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(`/equipment/${item.id}`)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        mr: 2,
                        color: `${getStatusColor(item.status)}.main`,
                      }}
                    >
                      {getStatusIcon(item.status)}
                    </Box>
                    <Typography variant="h6" component="div">
                      {item.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type: {item.type}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Location: {item.location}
                </Typography>
                
                {item.last_maintenance && (
                  <Typography variant="caption" color="text.secondary">
                    Last maintenance: {formatDateTime(item.last_maintenance)}
                  </Typography>
                )}
                
                {/* Latest sensor readings if available */}
                {item.latest_sensor_data && (
                  <Box mt={2}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Latest readings:
                    </Typography>
                    <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                      {item.latest_sensor_data.temperature && (
                        <Chip
                          icon={<Thermostat />}
                          label={`${item.latest_sensor_data.temperature}°C`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {item.latest_sensor_data.speed && (
                        <Chip
                          icon={<Speed />}
                          label={`${item.latest_sensor_data.speed} RPM`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredEquipment.length === 0 && (
        <Box textAlign="center" py={8}>
          <Engineering sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No equipment found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || statusFilter 
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first equipment to get started'}
          </Typography>
        </Box>
      )}

      {/* Create Equipment Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Equipment</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Equipment Name"
              value={newEquipment.name}
              onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Equipment Type"
              value={newEquipment.type}
              onChange={(e) => setNewEquipment(prev => ({ ...prev, type: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Location"
              value={newEquipment.location}
              onChange={(e) => setNewEquipment(prev => ({ ...prev, location: e.target.value }))}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Initial Status</InputLabel>
              <Select
                value={newEquipment.status}
                onChange={(e) => setNewEquipment(prev => ({ ...prev, status: e.target.value as any }))}
                label="Initial Status"
              >
                <MenuItem value={EQUIPMENT_STATUS.OPERATIONAL}>Operational</MenuItem>
                <MenuItem value={EQUIPMENT_STATUS.MAINTENANCE}>Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateEquipment}
            variant="contained"
            disabled={!newEquipment.name || !newEquipment.type || !newEquipment.location || createEquipmentMutation.isPending}
          >
            {createEquipmentMutation.isPending ? 'Creating...' : 'Create Equipment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Equipment;