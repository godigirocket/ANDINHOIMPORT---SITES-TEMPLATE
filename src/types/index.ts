// Tipos TypeScript centralizados

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lockoutRemaining?: number;
}

// Re-export Product from productStore for backwards compatibility
export type { Product } from '@/lib/stores/productStore';
