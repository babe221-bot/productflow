import React, { useState } from 'react';
import {
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Backdrop,
} from '@mui/material';
import {
  Add,
  Build,
  Assessment,
  Refresh,
  Warning,
  Person,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const QuickActions = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    {
      icon: <Build />,
      name: 'Schedule Maintenance',
      action: () => {
        navigate('/maintenance');
        handleClose();
      },
    },
    {
      icon: <Assessment />,
      name: 'View Analytics',
      action: () => {
        navigate('/analytics');
        handleClose();
      },
    },
    {
      icon: <Warning />,
      name: 'Create Alert',
      action: () => {
        // TODO: Open create alert dialog
        console.log('Create alert clicked');
        handleClose();
      },
    },
    {
      icon: <Person />,
      name: 'Add User',
      action: () => {
        navigate('/users');
        handleClose();
      },
    },
    {
      icon: <Refresh />,
      name: 'Refresh Data',
      action: () => {
        window.location.reload();
        handleClose();
      },
    },
  ];

  // Don't show on login page
  if (location.pathname === '/login' || !location.pathname.startsWith('/')) {
    return null;
  }

  return (
    <>
      <Backdrop open={open} sx={{ zIndex: 1200 }} />
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.action}
            sx={{
              '& .MuiSpeedDialAction-fab': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default QuickActions;