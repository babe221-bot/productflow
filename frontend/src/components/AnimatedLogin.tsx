import React, { useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  Alert,
} from '@mui/material';
import { LockOutlined, Factory } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import GlowingButton from './GlowingButton';
import AnimatedCard from './AnimatedCard';

// @ts-ignore
const anime = require('animejs');

interface AnimatedLoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string;
}

const AnimatedLogin: React.FC<AnimatedLoginProps> = ({ onLogin, loading, error }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLElement>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Animate logo on mount
    if (logoRef.current) {
      anime({
        targets: logoRef.current,
        scale: [0, 1.2, 1],
        rotate: [0, 360],
        duration: 1200,
        easing: 'easeOutElastic(1, .8)',
        delay: 200,
      });
    }

    // Animate title
    if (titleRef.current) {
      anime({
        targets: titleRef.current,
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutCubic',
        delay: 600,
      });
    }

    // Create floating particles
    if (containerRef.current) {
      const container = containerRef.current;
      
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 6 + 3}px;
          height: ${Math.random() * 6 + 3}px;
          background: radial-gradient(circle, rgba(100, 181, 246, 0.8) 0%, rgba(156, 39, 176, 0.4) 100%);
          border-radius: 50%;
          pointer-events: none;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(particle);
        
        anime({
          targets: particle,
          translateY: [
            { value: Math.random() * 100 - 50, duration: 3000 + Math.random() * 2000 },
            { value: Math.random() * 100 - 50, duration: 3000 + Math.random() * 2000 },
          ],
          translateX: [
            { value: Math.random() * 100 - 50, duration: 4000 + Math.random() * 2000 },
            { value: Math.random() * 100 - 50, duration: 4000 + Math.random() * 2000 },
          ],
          opacity: [
            { value: Math.random() * 0.5 + 0.2, duration: 2000 + Math.random() * 1000 },
            { value: Math.random() * 0.8 + 0.3, duration: 2000 + Math.random() * 1000 },
          ],
          scale: [
            { value: 0.5 + Math.random() * 0.5, duration: 2500 + Math.random() * 1500 },
            { value: 0.5 + Math.random() * 0.5, duration: 2500 + Math.random() * 1500 },
          ],
          loop: true,
          easing: 'easeInOutSine',
          delay: Math.random() * 3000,
        });
      }
    }
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: 'admin@example.com',
      password: 'password123',
    },
    validationSchema,
    onSubmit: async (values) => {
      const success = await onLogin(values.email, values.password);
      if (success) {
        // Animate success and navigate
        anime({
          targets: '.login-form',
          scale: [1, 1.05, 0.95],
          opacity: [1, 0],
          duration: 600,
          easing: 'easeInCubic',
          complete: () => {
            navigate(from, { replace: true });
          },
        });
      }
    },
  });

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse at top left, rgba(26, 35, 126, 0.4) 0%, transparent 50%),
          radial-gradient(ellipse at top right, rgba(74, 20, 140, 0.4) 0%, transparent 50%),
          radial-gradient(ellipse at bottom center, rgba(13, 71, 161, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #0a1929 0%, #1a237e 50%, #4a148c 100%)
        `,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 30% 70%, rgba(100, 181, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)
          `,
          animation: 'pulse 6s ease-in-out infinite alternate',
        },
        '@keyframes pulse': {
          '0%': { opacity: 0.4 },
          '100%': { opacity: 0.8 },
        },
      }}
    >
      <Container component="main" maxWidth="sm">
        <AnimatedCard
          animationType="scaleIn"
          delay={800}
          className="login-form"
          sx={{
            background: 'rgba(10, 25, 41, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(100, 181, 246, 0.3)',
            borderRadius: 4,
            overflow: 'visible',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              {/* Animated Logo */}
              <Avatar
                sx={{
                  m: 1,
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(45deg, #64b5f6, #ab47bc)',
                  border: '3px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(100, 181, 246, 0.3)',
                }}
              >
                <Factory 
                  ref={logoRef}
                  sx={{ 
                    fontSize: 40,
                    color: '#ffffff',
                  }} 
                />
              </Avatar>
              
              <Typography
                ref={titleRef}
                component="h1"
                variant="h3"
                sx={{
                  mt: 2,
                  mb: 1,
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #64b5f6, #ab47bc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textAlign: 'center',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                ProducFlow
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary',
                  textAlign: 'center',
                  opacity: 0.8,
                  mb: 2,
                }}
              >
                Smart Manufacturing Platform
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'primary.light',
                  textAlign: 'center',
                  background: 'rgba(100, 181, 246, 0.1)',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  border: '1px solid rgba(100, 181, 246, 0.3)',
                }}
              >
                Welcome Back
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  background: 'rgba(244, 67, 54, 0.1)',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  color: 'error.main',
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{
                  mb: 2,
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  mb: 3,
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
              
              <GlowingButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                pulseAnimation={!loading}
                glowColor="#64b5f6"
                startIcon={<LockOutlined />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: loading 
                    ? 'linear-gradient(45deg, rgba(100, 181, 246, 0.5), rgba(156, 39, 176, 0.5))'
                    : 'linear-gradient(45deg, #64b5f6, #ab47bc)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #42a5f5, #8e24aa)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(100, 181, 246, 0.4)',
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </GlowingButton>
            </Box>

            <Box mt={4} textAlign="center">
              <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.6 }}>
                Demo Credentials: admin@example.com / password123
              </Typography>
            </Box>
          </CardContent>
        </AnimatedCard>
      </Container>
    </Box>
  );
};

export default AnimatedLogin;