import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import { Factory, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface DemoCredential {
  role: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('admin@producflow.com');
  const [password, setPassword] = useState<string>('admin123');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const demoCredentials: DemoCredential[] = [
    { role: 'Admin', email: 'admin@producflow.com', password: 'admin123' },
    { role: 'Manager', email: 'manager@producflow.com', password: 'manager123' },
    { role: 'Technician', email: 'tech@producflow.com', password: 'tech123' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <Factory fontSize="large" />
        </Avatar>
        <Typography component="h1" variant="h4" gutterBottom>
          ProducFlow
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manufacturing Management System
        </Typography>

        <Card sx={{ mt: 3, width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                startIcon={<LoginIcon />}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Demo Credentials:
              </Typography>
              <Stack direction="column" spacing={1}>
                {demoCredentials.map((cred) => (
                  <Chip
                    key={cred.role}
                    label={`${cred.role}: ${cred.email}`}
                    variant="outlined"
                    clickable
                    onClick={() => handleDemoLogin(cred.email, cred.password)}
                    sx={{ justifyContent: 'flex-start' }}
                  />
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;