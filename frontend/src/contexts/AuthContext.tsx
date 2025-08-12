import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../hooks/useAuth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, login, logout, isLoading, token, isAuthenticated } = useAuthStore();

  // Initialize axios token on mount if it exists
  useEffect(() => {
    if (token && isAuthenticated) {
      const axios = require('axios');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token, isAuthenticated]);

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading: isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};