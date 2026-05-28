import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { clientConfig } from '@/config/client';
import { User, AuthState } from '@/types';
import { z } from 'zod';

// ── Schemas de validação ──────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email('Email inválido').max(254),
  password: z.string().min(6, 'Senha muito curta').max(128),
});

// ── Rate limiting — brute force protection ────────────────────
const RATE_KEY    = `${clientConfig.id}_login_attempts`;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutos

interface RateData { count: number; firstAt: number; lockedUntil?: number }

function getRateData(): RateData {
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    return raw ? JSON.parse(raw) : { count: 0, firstAt: Date.now() };
  } catch { return { count: 0, firstAt: Date.now() }; }
}

function setRateData(d: RateData) {
  try { sessionStorage.setItem(RATE_KEY, JSON.stringify(d)); } catch {}
}

function checkRateLimit(): { blocked: boolean; remainingMs: number } {
  const d = getRateData();
  if (d.lockedUntil && Date.now() < d.lockedUntil) {
    return { blocked: true, remainingMs: d.lockedUntil - Date.now() };
  }
  // Reset se passou a janela
  if (Date.now() - d.firstAt > LOCKOUT_MS) {
    setRateData({ count: 0, firstAt: Date.now() });
    return { blocked: false, remainingMs: 0 };
  }
  return { blocked: false, remainingMs: 0 };
}

function recordFailedAttempt() {
  const d = getRateData();
  const count = d.count + 1;
  if (count >= MAX_ATTEMPTS) {
    setRateData({ count, firstAt: d.firstAt, lockedUntil: Date.now() + LOCKOUT_MS });
  } else {
    setRateData({ count, firstAt: d.firstAt });
  }
}

function clearRateData() {
  try { sessionStorage.removeItem(RATE_KEY); } catch {}
}

// ── Sanitização básica ────────────────────────────────────────
function sanitize(str: string): string {
  return str.trim().slice(0, 512);
}

// ── Timing constante (previne timing attacks) ─────────────────
async function constantTimeDelay(ms = 300) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Tipos ─────────────────────────────────────────────────────
interface AuthContextType extends AuthState {
  login:      (email: string, password: string) => Promise<boolean>;
  logout:     () => void;
  clearError: () => void;
  lockoutRemaining: number; // segundos restantes de bloqueio
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null, isAuthenticated: false, isLoading: true, error: null,
  });
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Atualiza countdown de bloqueio
  useEffect(() => {
    const interval = setInterval(() => {
      const { blocked, remainingMs } = checkRateLimit();
      setLockoutRemaining(blocked ? Math.ceil(remainingMs / 1000) : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = useCallback(() => {
    try {
      const raw = localStorage.getItem(`${clientConfig.id}_auth`);
      if (!raw) { setState(p => ({ ...p, isLoading: false })); return; }

      const { user, expiresAt, fingerprint } = JSON.parse(raw);

      // Valida expiração
      if (Date.now() >= expiresAt) {
        localStorage.removeItem(`${clientConfig.id}_auth`);
        setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        return;
      }

      // Valida fingerprint básico (user agent)
      const currentFp = btoa(navigator.userAgent.slice(0, 50));
      if (fingerprint && fingerprint !== currentFp) {
        localStorage.removeItem(`${clientConfig.id}_auth`);
        setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        return;
      }

      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch {
      localStorage.removeItem(`${clientConfig.id}_auth`);
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  }, []);

  const login = useCallback(async (rawEmail: string, rawPassword: string): Promise<boolean> => {
    setState(p => ({ ...p, isLoading: true, error: null }));

    // Rate limit check
    const { blocked, remainingMs } = checkRateLimit();
    if (blocked) {
      const mins = Math.ceil(remainingMs / 60000);
      setState(p => ({ ...p, isLoading: false, error: `Muitas tentativas. Aguarde ${mins} minuto(s).` }));
      return false;
    }

    // Sanitização
    const email    = sanitize(rawEmail);
    const password = sanitize(rawPassword);

    // Delay constante (anti-timing attack)
    await constantTimeDelay(300 + Math.random() * 200);

    try {
      loginSchema.parse({ email, password });

      const validEmail = clientConfig.admin.credentials.email;
      const validPass  = clientConfig.admin.credentials.password;

      // Comparação com timing constante simulado
      const emailOk = email === validEmail;
      const passOk  = password === validPass;

      if (!emailOk || !passOk) {
        recordFailedAttempt();
        const { blocked: nowBlocked } = checkRateLimit();
        const msg = nowBlocked
          ? `Conta bloqueada por 15 minutos após ${MAX_ATTEMPTS} tentativas.`
          : 'Credenciais inválidas';
        setState(p => ({ ...p, error: msg, isLoading: false }));
        return false;
      }

      // Sucesso — limpa rate limit
      clearRateData();

      const user: User = { id: '1', email, name: 'Administrador', role: 'admin' };
      const fingerprint = btoa(navigator.userAgent.slice(0, 50));

      const authData = {
        user,
        expiresAt:   Date.now() + clientConfig.admin.credentials.sessionDuration * 3600_000,
        fingerprint,
        // Não armazenamos senha — apenas token de sessão
        sessionId:   crypto.randomUUID(),
      };

      localStorage.setItem(`${clientConfig.id}_auth`, JSON.stringify(authData));
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
      return true;

    } catch (err) {
      const msg = err instanceof z.ZodError
        ? err.errors[0].message
        : err instanceof Error ? err.message : 'Erro ao fazer login';
      setState(p => ({ ...p, error: msg, isLoading: false }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(`${clientConfig.id}_auth`);
    clearRateData();
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState(p => ({ ...p, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, clearError, lockoutRemaining }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
