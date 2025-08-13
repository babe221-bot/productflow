import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Engineering,
  Build,
  Analytics,
  People,
  AccountCircle,
  Logout,
  Factory,
  Notifications,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import NotificationCenter from './NotificationCenter';
import StatusIndicator from './StatusIndicator';
import QuickActions from './QuickActions';
import animate from 'animejs';

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Equipment', icon: <Engineering />, path: '/equipment' },
  { text: 'Maintenance', icon: <Build />, path: '/maintenance' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'Users', icon: <People />, path: '/users' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Animate sidebar items on mount
    if (sidebarRef.current) {
      const listItems = sidebarRef.current.querySelectorAll('.menu-item');
      animate({
        targets: listItems,
        translateX: [-30, 0],
        opacity: [0, 1],
        delay: animate.stagger(100, { start: 300 }),
        duration: 600,
        easing: 'easeOutCubic',
      });
    }

    // Animate logo
    if (logoRef.current) {
      animate({
        targets: logoRef.current,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutBack',
      });
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    
    // Add click animation to the selected item
    const clickedItem = document.querySelector(`[data-path="${path}"]`);
    if (clickedItem) {
      animate({
        targets: clickedItem,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeOutCubic',
      });
    }
  };

  const drawer = (
    <Box ref={sidebarRef}>
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.1), rgba(156, 39, 176, 0.1))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box display="flex" alignItems="center">
          <Factory 
            ref={logoRef}
            sx={{ 
              mr: 2, 
              fontSize: 32,
              color: 'primary.main',
              background: 'linear-gradient(45deg, #64b5f6, #ab47bc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }} 
          />
          <Typography 
            variant="h5" 
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #64b5f6, #ab47bc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ProducFlow
          </Typography>
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            display: 'block',
            mt: 0.5,
            opacity: 0.7,
          }}
        >
          Smart Manufacturing Platform
        </Typography>
      </Box>

      <List sx={{ px: 2, py: 3 }}>
        {menuItems.map((item, index) => (
          <ListItemButton
            key={item.text}
            className="menu-item"
            data-path={item.path}
            selected={location.pathname === item.path}
            onClick={() => handleMenuItemClick(item.path)}
            sx={{
              borderRadius: 3,
              mb: 1,
              position: 'relative',
              overflow: 'hidden',
              background: location.pathname === item.path 
                ? 'linear-gradient(45deg, rgba(25, 118, 210, 0.2), rgba(156, 39, 176, 0.2))'
                : 'transparent',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(100, 181, 246, 0.1), rgba(156, 39, 176, 0.1))',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::before': {
                opacity: 1,
              },
              '&:hover': {
                transform: 'translateX(8px)',
                boxShadow: '0 4px 20px rgba(100, 181, 246, 0.3)',
              },
              '&.Mui-selected': {
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 4,
                  height: '60%',
                  background: 'linear-gradient(45deg, #64b5f6, #ab47bc)',
                  borderRadius: '0 4px 4px 0',
                },
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                minWidth: 40,
                transition: 'color 0.3s ease',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? 'text.primary' : 'text.secondary',
                  transition: 'all 0.3s ease',
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(10, 25, 41, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(100, 181, 246, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                background: 'rgba(100, 181, 246, 0.1)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
              color: 'text.primary',
              fontWeight: 600,
            }}
          >
            Manufacturing Operations Center
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <StatusIndicator />
            <NotificationCenter />
            
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuClick}
              sx={{
                '&:hover': {
                  background: 'rgba(100, 181, 246, 0.1)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(45deg, #64b5f6, #ab47bc)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                background: 'rgba(10, 25, 41, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(100, 181, 246, 0.2)',
                borderRadius: 2,
                minWidth: 180,
              },
            }}
          >
            <MenuItem 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  background: 'rgba(244, 67, 54, 0.1)',
                },
              }}
            >
              <Logout sx={{ mr: 1, color: 'error.main' }} />
              <Typography sx={{ color: 'text.primary' }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'rgba(10, 25, 41, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRight: '1px solid rgba(100, 181, 246, 0.2)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'rgba(10, 25, 41, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRight: '1px solid rgba(100, 181, 246, 0.2)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          position: 'relative',
        }}
      >
        {children}
        <QuickActions />
      </Box>
    </Box>
  );
};

export default Layout;