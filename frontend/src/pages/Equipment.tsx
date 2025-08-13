import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Search,
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
import { EQUIPMENT_STATUS } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedCard from '../components/AnimatedCard';
import GlowingButton from '../components/GlowingButton';
import { animate } from 'animejs';

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
  const titleRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { 
    data: equipment = [], 
    isLoading, 
    error, 
    refetch 
  } = useEquipment(statusFilter || undefined);
  
  const createEquipmentMutation = useCreateEquipment();

  useEffect(() => {
    // Animate page title
    if (titleRef.current) {
      animate({
        targets: titleRef.current,
        translateY: [-30, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800,
        easing: 'easeOutBack',
      });
    }

    // Animate search bar
    if (searchRef.current) {
      animate({
        targets: searchRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        delay: 200,
        easing: 'easeOutCubic',
      });
    }
  }, []);

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
      <Box sx={{ p: 3 }}>
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
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* Page Header */}
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
          Equipment Management
        </Typography>
        
        <GlowingButton
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsCreateDialogOpen(true)}
          pulseAnimation
          glowColor="#00e676"
          sx={{
            background: 'linear-gradient(45deg, #00e676, #64b5f6)',
            '&:hover': {
              background: 'linear-gradient(45deg, #00c853, #42a5f5)',
            },
          }}
        >
          Add Equipment
        </GlowingButton>
      </Box>

      {/* Filters */}
      <AnimatedCard animationType="fadeInUp" sx={{ mb: 3 }} ref={searchRef}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search equipment by name, type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(100, 181, 246, 0.05)',
                    '&:hover': {
                      background: 'rgba(100, 181, 246, 0.1)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(100, 181, 246, 0.1)',
                      boxShadow: '0 0 20px rgba(100, 181, 246, 0.3)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'text.secondary' }}>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                  sx={{
                    background: 'rgba(100, 181, 246, 0.05)',
                    '&:hover': {
                      background: 'rgba(100, 181, 246, 0.1)',
                    },
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value={EQUIPMENT_STATUS.OPERATIONAL}>
                    <Box display="flex" alignItems="center">
                      <CheckCircle sx={{ mr: 1, color: 'success.main', fontSize: 18 }} />
                      Operational
                    </Box>
                  </MenuItem>
                  <MenuItem value={EQUIPMENT_STATUS.WARNING}>
                    <Box display="flex" alignItems="center">
                      <Warning sx={{ mr: 1, color: 'warning.main', fontSize: 18 }} />
                      Warning
                    </Box>
                  </MenuItem>
                  <MenuItem value={EQUIPMENT_STATUS.CRITICAL}>
                    <Box display="flex" alignItems="center">
                      <Error sx={{ mr: 1, color: 'error.main', fontSize: 18 }} />
                      Critical
                    </Box>
                  </MenuItem>
                  <MenuItem value={EQUIPMENT_STATUS.MAINTENANCE}>
                    <Box display="flex" alignItems="center">
                      <Build sx={{ mr: 1, color: 'info.main', fontSize: 18 }} />
                      Maintenance
                    </Box>
                  </MenuItem>
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
                sx={{
                  height: 56,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.light',
                    background: 'rgba(100, 181, 246, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(100, 181, 246, 0.3)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Box>
      </AnimatedCard>

      {/* Equipment Grid */}
      <Grid container spacing={3}>
        {filteredEquipment.map((item: EquipmentType, index: number) => (
          <Grid item xs={12} sm={6} lg={4} key={item.id}>
            <AnimatedCard 
              animationType={index % 3 === 0 ? 'fadeInUp' : index % 3 === 1 ? 'scaleIn' : 'slideInLeft'}
              delay={index * 100}
              onClick={() => navigate(`/equipment/${item.id}`)}
              sx={{
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible',
                background: 'rgba(10, 25, 41, 0.6)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: getStatusColor(item.status) === 'success' ? 
                    'linear-gradient(45deg, #00e676, #4caf50)' :
                    getStatusColor(item.status) === 'warning' ?
                    'linear-gradient(45deg, #ff9800, #ffc107)' :
                    getStatusColor(item.status) === 'error' ?
                    'linear-gradient(45deg, #f44336, #ff1744)' :
                    'linear-gradient(45deg, #2196f3, #03a9f4)',
                  borderRadius: '16px 16px 0 0',
                },
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" alignItems="center" flex={1}>
                    <Box
                      sx={{
                        mr: 2,
                        p: 1.5,
                        borderRadius: '50%',
                        background: `${getStatusColor(item.status) === 'success' ? 'rgba(0, 230, 118, 0.2)' : 
                                      getStatusColor(item.status) === 'warning' ? 'rgba(255, 152, 0, 0.2)' : 
                                      getStatusColor(item.status) === 'error' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(33, 150, 243, 0.2)'}`,
                        color: `${getStatusColor(item.status)}.main`,
                        border: `2px solid ${getStatusColor(item.status) === 'success' ? '#00e676' : 
                                              getStatusColor(item.status) === 'warning' ? '#ff9800' : 
                                              getStatusColor(item.status) === 'error' ? '#f44336' : '#2196f3'}40`,
                      }}
                    >
                      {getStatusIcon(item.status)}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'text.primary',
                        fontWeight: 600,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status) as any}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </Box>
                
                <Box 
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    <strong>Type:</strong> {item.type}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Location:</strong> {item.location}
                  </Typography>
                </Box>
                
                {item.last_maintenance && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      display: 'block',
                      mb: 2,
                      opacity: 0.8,
                    }}
                  >
                    Last maintenance: {formatDateTime(item.last_maintenance)}
                  </Typography>
                )}
                
                {/* Latest sensor readings */}
                {item.latest_sensor_data && (
                  <Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'primary.light', 
                        display: 'block',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      Latest Sensor Data:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {item.latest_sensor_data.temperature && (
                        <Chip
                          icon={<Thermostat />}
                          label={`${item.latest_sensor_data.temperature}°C`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: 'rgba(255, 87, 34, 0.5)',
                            color: '#ff5722',
                            background: 'rgba(255, 87, 34, 0.1)',
                          }}
                        />
                      )}
                      {item.latest_sensor_data.speed && (
                        <Chip
                          icon={<Speed />}
                          label={`${item.latest_sensor_data.speed} RPM`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: 'rgba(33, 150, 243, 0.5)',
                            color: '#2196f3',
                            background: 'rgba(33, 150, 243, 0.1)',
                          }}
                        />
                      )}
                      {item.latest_sensor_data.pressure && (
                        <Chip
                          icon={<Engineering />}
                          label={`${item.latest_sensor_data.pressure} PSI`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: 'rgba(156, 39, 176, 0.5)',
                            color: '#9c27b0',
                            background: 'rgba(156, 39, 176, 0.1)',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredEquipment.length === 0 && (
        <Box textAlign="center" py={8}>
          <AnimatedCard animationType="scaleIn" delay={300}>
            <Box sx={{ p: 6 }}>
              <Engineering 
                sx={{ 
                  fontSize: 80, 
                  color: 'primary.main', 
                  mb: 3,
                  opacity: 0.7,
                }} 
              />
              <Typography variant="h5" sx={{ color: 'text.primary', mb: 2 }}>
                No Equipment Found
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Add your first equipment to get started with monitoring'}
              </Typography>
              <GlowingButton
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setIsCreateDialogOpen(true)}
                sx={{ mt: 2 }}
              >
                Add Equipment
              </GlowingButton>
            </Box>
          </AnimatedCard>
        </Box>
      )}

      {/* Create Equipment Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(10, 25, 41, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(100, 181, 246, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'text.primary', fontWeight: 600 }}>
          Add New Equipment
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Equipment Name"
              value={newEquipment.name}
              onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(100, 181, 246, 0.05)',
                },
              }}
            />
            <TextField
              fullWidth
              label="Equipment Type"
              value={newEquipment.type}
              onChange={(e) => setNewEquipment(prev => ({ ...prev, type: e.target.value }))}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(100, 181, 246, 0.05)',
                },
              }}
            />
            <TextField
              fullWidth
              label="Location"
              value={newEquipment.location}
              onChange={(e) => setNewEquipment(prev => ({ ...prev, location: e.target.value }))}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(100, 181, 246, 0.05)',
                },
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: 'text.secondary' }}>Initial Status</InputLabel>
              <Select
                value={newEquipment.status}
                onChange={(e) => setNewEquipment(prev => ({ ...prev, status: e.target.value as any }))}
                label="Initial Status"
                sx={{
                  background: 'rgba(100, 181, 246, 0.05)',
                }}
              >
                <MenuItem value={EQUIPMENT_STATUS.OPERATIONAL}>
                  <Box display="flex" alignItems="center">
                    <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                    Operational
                  </Box>
                </MenuItem>
                <MenuItem value={EQUIPMENT_STATUS.MAINTENANCE}>
                  <Box display="flex" alignItems="center">
                    <Build sx={{ mr: 1, color: 'info.main' }} />
                    Maintenance
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setIsCreateDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <GlowingButton 
            onClick={handleCreateEquipment}
            variant="contained"
            disabled={!newEquipment.name || !newEquipment.type || !newEquipment.location || createEquipmentMutation.isPending}
            glowColor="#00e676"
          >
            {createEquipmentMutation.isPending ? 'Creating...' : 'Create Equipment'}
          </GlowingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Equipment;