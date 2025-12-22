'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clientConfig } from '@/config/client';
import { User, AuthState } from '@/types';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const authData = localStorage.getItem(`${clientConfig.id}_auth`);
      if (authData) {
        const { user, expiresAt } = JSON.parse(authData);
        
        if (Date.now() < expiresAt) {
          setState({ user, isAuthenticated: true, isLoading: false, error: null });
        } else {
          localStorage.removeItem(`${clientConfig.id}_auth`);
          setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      loginSchema.parse({ email, password });
      
      // Mock login - substituir por API real futuramente
      if (email === clientConfig.admin.credentials.email && 
          password === clientConfig.admin.credentials.password) {
        
        const user: User = {
          id: '1',
          email,
          name: 'Administrador',
          role: 'admin'
        };
        
        const authData = {
          user,
          token: 'mock-jwt-token-' + Date.now(),
          expiresAt: Date.now() + (clientConfig.admin.credentials.sessionDuration * 60 * 60 * 1000)
        };
        
        localStorage.setItem(`${clientConfig.id}_auth`, JSON.stringify(authData));
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return true;
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      const errorMessage = error instanceof z.ZodError 
        ? error.errors[0].message
        : error instanceof Error
        ? error.message
        : 'Erro ao fazer login';
      
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(`${clientConfig.id}_auth`);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
