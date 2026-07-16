import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';
import { User, AuthState } from '@/types';
import type { Session } from '@supabase/supabase-js';

/**
 * AUTENTICAÇÃO VIA SUPABASE AUTH
 * 
 * O admin faz login com email/senha via Supabase Auth.
 * Isso gera um JWT com role=authenticated que as RLS policies validam.
 * Sem login autenticado, o anon key NÃO pode fazer INSERT/UPDATE/DELETE.
 * 
 * SETUP OBRIGATÓRIO:
 * 1. No Supabase Dashboard → Authentication → Settings → habilite Email provider
 * 2. Crie o usuário admin manualmente:
 *    - Via Dashboard: Authentication → Users → Add User
 *    - Ou via SQL: SELECT supabase.auth.admin_create_user(...)
 * 3. Configure o email/senha no .env ou use o mesmo do client.ts como fallback
 */

interface AuthContextType extends AuthState {
  login:      (email: string, password: string) => Promise<boolean>;
  logout:     () => void;
  clearError: () => void;
  lockoutRemaining: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return !!url && url !== 'https://placeholder.supabase.co' && url.includes('supabase.co');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null, isAuthenticated: false, isLoading: true, error: null,
  });

  useEffect(() => {
    checkSession();

    // Escuta mudanças de sessão (login/logout em outra aba, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUserFromSession(session);
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setUserFromSession = (session: Session) => {
    const user: User = {
      id: session.user.id,
      email: session.user.email ?? '',
      name: session.user.user_metadata?.name ?? 'Administrador',
      role: 'admin',
    };
    setState({ user, isAuthenticated: true, isLoading: false, error: null });
  };

  const checkSession = async () => {
    if (!isSupabaseConfigured()) {
      // Fallback local se Supabase não configurado (desenvolvimento)
      checkLocalAuth();
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUserFromSession(session);
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  };

  // Fallback local para desenvolvimento sem Supabase
  const checkLocalAuth = () => {
    try {
      const raw = localStorage.getItem(`${clientConfig.id}_auth`);
      if (!raw) { setState(p => ({ ...p, isLoading: false })); return; }
      const { user, expiresAt } = JSON.parse(raw);
      if (Date.now() >= expiresAt) {
        localStorage.removeItem(`${clientConfig.id}_auth`);
        setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        return;
      }
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch {
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(p => ({ ...p, isLoading: true, error: null }));

    if (!isSupabaseConfigured()) {
      // Fallback local (desenvolvimento sem Supabase)
      return loginLocal(email, password);
    }

    // Login via Supabase Auth — gera JWT authenticated
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.error('[Auth] ❌ Erro de login:', error.message);
      let msg = 'Credenciais inválidas';
      if (error.message.includes('Invalid login')) msg = 'Email ou senha incorretos';
      if (error.message.includes('Email not confirmed')) msg = 'Email não confirmado. Verifique sua caixa de entrada.';
      setState(p => ({ ...p, error: msg, isLoading: false }));
      return false;
    }

    if (data.session) {
      setUserFromSession(data.session);
      return true;
    }

    setState(p => ({ ...p, error: 'Erro inesperado no login', isLoading: false }));
    return false;
  }, []);

  // Fallback local para quando Supabase não está configurado
  const loginLocal = (email: string, password: string): boolean => {
    const validEmail = clientConfig.admin.credentials.email;
    const validPass = clientConfig.admin.credentials.password;

    if (email.trim() === validEmail && password.trim() === validPass) {
      const user: User = { id: '1', email, name: 'Administrador', role: 'admin' };
      const authData = {
        user,
        expiresAt: Date.now() + clientConfig.admin.credentials.sessionDuration * 3600_000,
      };
      localStorage.setItem(`${clientConfig.id}_auth`, JSON.stringify(authData));
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;
    }

    setState(p => ({ ...p, error: 'Credenciais inválidas', isLoading: false }));
    return false;
  };

  const logout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(`${clientConfig.id}_auth`);
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState(p => ({ ...p, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError, lockoutRemaining: 0 }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
