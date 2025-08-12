import React, { useState, useEffect, useRef } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Backdrop,
} from '@mui/material';
import {
  Build,
  Assessment,
  Refresh,
  Warning,
  Person,
  Close,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import * as anime from 'animejs';
import FloatingActionButton from './FloatingActionButton';

interface QuickAction {
  icon: React.ReactNode;
  name: string;
  action: () => void;
  color: string;
}

const QuickActions: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const speedDialRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setOpen(true);
    
    // Animate actions appearance
    setTimeout(() => {
      const actions = document.querySelectorAll('.MuiSpeedDialAction-fab');
      anime({
        targets: actions,
        scale: [0, 1],
        rotate: [180, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 400,
        easing: 'easeOutBack',
      });
    }, 50);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const actions: QuickAction[] = [
    {
      icon: <Build />,
      name: 'Schedule Maintenance',
      color: '#ff9800',
      action: () => {
        navigate('/maintenance');
        handleClose();
      },
    },
    {
      icon: <Assessment />,
      name: 'View Analytics',
      color: '#2196f3',
      action: () => {
        navigate('/analytics');
        handleClose();
      },
    },
    {
      icon: <Warning />,
      name: 'Create Alert',
      color: '#f44336',
      action: () => {
        // TODO: Open create alert dialog
        console.log('Create alert clicked');
        handleClose();
      },
    },
    {
      icon: <Person />,
      name: 'Add User',
      color: '#9c27b0',
      action: () => {
        navigate('/users');
        handleClose();
      },
    },
    {
      icon: <Refresh />,
      name: 'Refresh Data',
      color: '#4caf50',
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
      <Backdrop 
        open={open} 
        sx={{ 
          zIndex: 1200,
          background: 'rgba(10, 25, 41, 0.8)',
          backdropFilter: 'blur(4px)',
        }} 
      />
      <SpeedDial
        ref={speedDialRef}
        ariaLabel="Quick Actions"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1300,
          '& .MuiSpeedDial-fab': {
            background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
            color: '#ffffff',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 30px rgba(100, 181, 246, 0.4)',
            width: 64,
            height: 64,
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #8e24aa)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 40px rgba(100, 181, 246, 0.6)',
            },
          },
        }}
        icon={<SpeedDialIcon openIcon={<Close />} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
      >
        {actions.map((action, index) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.action}
            sx={{
              '& .MuiSpeedDialAction-fab': {
                background: `linear-gradient(45deg, ${action.color}, ${action.color}dd)`,
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                boxShadow: `0 4px 20px ${action.color}40`,
                width: 48,
                height: 48,
                '&:hover': {
                  background: `linear-gradient(45deg, ${action.color}, ${action.color}aa)`,
                  transform: 'scale(1.2)',
                  boxShadow: `0 8px 30px ${action.color}60`,
                },
              },
              '& .MuiSpeedDialAction-staticTooltipLabel': {
                background: 'rgba(10, 25, 41, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(100, 181, 246, 0.3)',
                color: '#ffffff',
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              },
            }}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default QuickActions;