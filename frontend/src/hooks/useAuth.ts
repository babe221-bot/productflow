import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { access_token } = await authAPI.login(email, password);
          
          // Set token in localStorage and axios headers
          localStorage.setItem('token', access_token);
          
          // Fetch user profile
          const user = await authAPI.getCurrentUser();
          
          set({ 
            token: access_token, 
            user, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          return { success: true };
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.detail || 'Login failed' 
          };
        }
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);