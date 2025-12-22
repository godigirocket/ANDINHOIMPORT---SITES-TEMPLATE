// Tipos TypeScript centralizados

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  installments: number;
  image: string;
  status: 'active' | 'inactive';
  category?: string;
  badge?: string;
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

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
}

export interface SiteContent {
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaPrimary: { text: string; icon: string };
    ctaSecondary: { text: string; icon: string };
    socialProof: string[];
  };
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  products: {
    title: string;
    emptyState: {
      title: string;
      description: string;
      cta: string;
    };
  };
  socialProof: {
    title: string;
    instagramPosts: string[];
  };
  cta: {
    headline: string;
    subheadline: string;
    buttonText: string;
  };
}

export interface DashboardStats {
  activeProducts: number;
  totalProducts: number;
  instagramFollowers: string;
  monthlySales: string;
}
