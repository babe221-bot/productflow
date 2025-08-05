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
  Avatar,
} from '@mui/material';
import {
  Person,
  AdminPanelSettings,
  Engineering,
  SupervisorAccount,
  Add,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    // Mock user data - in real implementation, this would come from an API
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          email: 'admin@producflow.com',
          full_name: 'Admin User',
          role: 'admin',
          department: 'IT',
          is_active: true,
          created_at: '2023-01-15T10:00:00Z',
        },
        {
          id: 2,
          email: 'manager@producflow.com',
          full_name: 'Production Manager',
          role: 'manager',
          department: 'Production',
          is_active: true,
          created_at: '2023-02-20T14:30:00Z',
        },
        {
          id: 3,
          email: 'tech@producflow.com',
          full_name: 'Maintenance Technician',
          role: 'technician',
          department: 'Maintenance',
          is_active: true,
          created_at: '2023-03-10T09:15:00Z',
        },
        {
          id: 4,
          email: 'operator1@producflow.com',
          full_name: 'Machine Operator 1',
          role: 'operator',
          department: 'Production',
          is_active: true,
          created_at: '2023-04-05T11:45:00Z',
        },
        {
          id: 5,
          email: 'operator2@producflow.com',
          full_name: 'Machine Operator 2',
          role: 'operator',
          department: 'Production',
          is_active: false,
          created_at: '2023-05-12T16:20:00Z',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [roleFilter]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'technician':
        return 'info';
      case 'operator':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings />;
      case 'manager':
        return <SupervisorAccount />;
      case 'technician':
        return <Engineering />;
      case 'operator':
        return <Person />;
      default:
        return <Person />;
    }
  };

  const filteredUsers = roleFilter 
    ? users.filter(user => user.role === roleFilter)
    : users;

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  // Check if current user has admin privileges
  const canManageUsers = currentUser?.role === 'admin';

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">User Management</Typography>
        <Box display="flex" gap={2}>
          {canManageUsers && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {/* TODO: Open create user dialog */}}
            >
              Add User
            </Button>
          )}
          <IconButton onClick={() => window.location.reload()} color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {!canManageUsers && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You have read-only access to user information. Contact an administrator to manage users.
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3}>
        <TextField
          select
          label="Filter by Role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="technician">Technician</MenuItem>
          <MenuItem value="operator">Operator</MenuItem>
        </TextField>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredUsers.map((user) => (
          <Grid item xs={12} md={6} lg={4} key={user.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, bgcolor: `${getRoleColor(user.role)}.main` }}>
                    {getRoleIcon(user.role)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {user.full_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    icon={getRoleIcon(user.role)}
                    label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                  <Chip
                    label={user.is_active ? 'Active' : 'Inactive'}
                    color={user.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Department: {user.department}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Member since: {new Date(user.created_at).toLocaleDateString()}
                </Typography>

                {canManageUsers && (
                  <Box mt={2} display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {/* TODO: Open edit user dialog */}}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color={user.is_active ? 'error' : 'success'}
                      onClick={() => {/* TODO: Toggle user status */}}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredUsers.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {roleFilter ? 'Try changing the filter criteria' : 'No users have been added yet'}
          </Typography>
        </Box>
      )}

      {/* User Statistics */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4" color="primary">
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4" color="success.main">
                {users.filter(u => u.is_active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Administrators
              </Typography>
              <Typography variant="h4" color="error.main">
                {users.filter(u => u.role === 'admin').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Operators
              </Typography>
              <Typography variant="h4" color="info.main">
                {users.filter(u => u.role === 'operator').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Users;