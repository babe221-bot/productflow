import { createTheme, ThemeOptions } from '@mui/material/styles';

// Custom color palette - Dark theme with black, purple, and ocean blue
const customColors = {
  // Primary - Ocean Blue gradient
  oceanBlue: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#1976d2', // Main ocean blue
    600: '#1565c0',
    700: '#0d47a1',
    800: '#0a1929',
    900: '#040912',
  },
  
  // Secondary - Purple gradient
  cosmicPurple: {
    50: '#f3e5f5',
    100: '#e1bee7',
    200: '#ce93d8',
    300: '#ba68c8',
    400: '#ab47bc',
    500: '#9c27b0', // Main purple
    600: '#8e24aa',
    700: '#7b1fa2',
    800: '#6a1b9a',
    900: '#4a148c',
  },

  // Background gradients
  background: {
    primary: 'linear-gradient(135deg, #0a1929 0%, #1a237e 50%, #4a148c 100%)',
    secondary: 'linear-gradient(45deg, #040912 0%, #1565c0 50%, #6a1b9a 100%)',
    card: 'rgba(10, 25, 41, 0.8)',
    cardHover: 'rgba(26, 35, 126, 0.6)',
    glass: 'rgba(255, 255, 255, 0.05)',
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#b3b3b3',
    accent: '#64b5f6',
  },

  // Status colors with dark theme
  status: {
    success: '#00e676',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  }
};

export const darkAnimatedTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: customColors.oceanBlue[500],
      light: customColors.oceanBlue[300],
      dark: customColors.oceanBlue[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: customColors.cosmicPurple[500],
      light: customColors.cosmicPurple[300],
      dark: customColors.cosmicPurple[700],
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a1929',
      paper: 'rgba(10, 25, 41, 0.8)',
    },
    text: {
      primary: customColors.text.primary,
      secondary: customColors.text.secondary,
    },
    success: {
      main: customColors.status.success,
    },
    warning: {
      main: customColors.status.warning,
    },
    error: {
      main: customColors.status.error,
    },
    info: {
      main: customColors.status.info,
    },
  },
  
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      background: 'linear-gradient(45deg, #64b5f6, #ab47bc)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: customColors.text.primary,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: customColors.text.primary,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: customColors.text.primary,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: customColors.text.primary,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: customColors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      color: customColors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      color: customColors.text.secondary,
    },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: customColors.background.primary,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(100, 181, 246, 0.5)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(100, 181, 246, 0.8)',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: customColors.background.card,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: customColors.background.cardHover,
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(100, 181, 246, 0.2)',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(100, 181, 246, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0, #8e24aa)',
          },
        },
        outlined: {
          borderColor: 'rgba(100, 181, 246, 0.5)',
          color: customColors.text.primary,
          '&:hover': {
            borderColor: customColors.oceanBlue[400],
            background: 'rgba(100, 181, 246, 0.1)',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.1)',
          color: customColors.text.primary,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&.MuiChip-colorSuccess': {
            background: 'rgba(0, 230, 118, 0.2)',
            color: customColors.status.success,
            border: `1px solid ${customColors.status.success}40`,
          },
          '&.MuiChip-colorWarning': {
            background: 'rgba(255, 152, 0, 0.2)',
            color: customColors.status.warning,
            border: `1px solid ${customColors.status.warning}40`,
          },
          '&.MuiChip-colorError': {
            background: 'rgba(244, 67, 54, 0.2)',
            color: customColors.status.error,
            border: `1px solid ${customColors.status.error}40`,
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(100, 181, 246, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(100, 181, 246, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: customColors.oceanBlue[400],
            },
          },
          '& .MuiInputLabel-root': {
            color: customColors.text.secondary,
            '&.Mui-focused': {
              color: customColors.oceanBlue[400],
            },
          },
          '& .MuiOutlinedInput-input': {
            color: customColors.text.primary,
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 25, 41, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(10, 25, 41, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&:hover': {
            background: 'rgba(100, 181, 246, 0.1)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.2), rgba(156, 39, 176, 0.2))',
            '&:hover': {
              background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.3), rgba(156, 39, 176, 0.3))',
            },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          background: customColors.background.card,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'rgba(10, 25, 41, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
};

export const theme = createTheme(darkAnimatedTheme);

// Animation presets
export const animationPresets = {
  fadeInUp: {
    opacity: [0, 1],
    translateY: [30, 0],
    duration: 800,
    easing: 'easeOutCubic',
  },
  
  scaleIn: {
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutBack',
  },

  slideInLeft: {
    translateX: [-50, 0],
    opacity: [0, 1],
    duration: 700,
    easing: 'easeOutCubic',
  },

  pulse: {
    scale: [1, 1.05, 1],
    duration: 2000,
    loop: true,
    easing: 'easeInOutSine',
  },

  float: {
    translateY: [0, -10, 0],
    duration: 3000,
    loop: true,
    easing: 'easeInOutSine',
  },
};

export default theme;