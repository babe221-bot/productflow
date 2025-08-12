import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Fade,
} from '@mui/material';
import { Factory } from '@mui/icons-material';

const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 40, 
  showIcon = true,
  fullScreen = false 
}) => {
  const content = (
    <Fade in timeout={300}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{
          ...(fullScreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 9999,
          }),
          ...(fullScreen && {
            minHeight: '100vh',
          }),
          ...(!fullScreen && {
            py: 4,
          }),
        }}
      >
        <Box position="relative" display="inline-flex">
          <CircularProgress size={size} thickness={4} />
          {showIcon && (
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Factory 
                sx={{ 
                  fontSize: size * 0.4,
                  color: 'primary.main',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      opacity: 1,
                    },
                    '50%': {
                      opacity: 0.5,
                    },
                    '100%': {
                      opacity: 1,
                    },
                  },
                }} 
              />
            </Box>
          )}
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            animation: 'fadeInOut 2s infinite',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0.5 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.5 },
            },
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );

  return content;
};

export default LoadingSpinner;