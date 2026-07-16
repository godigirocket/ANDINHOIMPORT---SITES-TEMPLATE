import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  BarChart3,
  Image,
  MessageSquare,
  MessageCircle,
  CreditCard,
  ShoppingBag,
  Search,
  Instagram,
  Palette,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { clientConfig } from '@/config/client';
import { BrandLogo } from '@/components/BrandLogo';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Produtos', icon: Package, path: '/admin/products' },
  { label: 'Pedidos', icon: ShoppingBag, path: '/admin/orders' },
  { label: 'Conteúdo', icon: FileText, path: '/admin/content' },
  { label: 'Banners', icon: Image, path: '/admin/banners' },
  { label: 'Depoimentos', icon: MessageSquare, path: '/admin/testimonials' },
  { label: 'Instagram', icon: Instagram, path: '/admin/instagram' },
  { label: 'Chatbot', icon: MessageCircle, path: '/admin/chatbot' },
  { label: 'Pagamentos', icon: CreditCard, path: '/admin/payments' },
  { label: 'SEO & Google', icon: Search, path: '/admin/seo' },
  { label: 'Analytics & Pixels', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Editor de Tema', icon: Palette, path: '/admin/theme' },
  { label: 'Configurações', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Change favicon to admin version
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"][type="image/svg+xml"]') as HTMLLinkElement;
    if (favicon) {
      const originalHref = favicon.href;
      favicon.href = '/favicon-admin.svg';
      
      // Restore original favicon on unmount
      return () => {
        favicon.href = originalHref;
      };
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Carregando painel...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const currentPage = navItems.find((item) => item.path === location.pathname);

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-3 group" onClick={() => setIsSidebarOpen(false)}>
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-md group-hover:bg-primary/50 transition-all" />
            <BrandLogo size={36} className="relative" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-sm block truncate">{clientConfig.company.name}</span>
            <span className="text-xs text-muted-foreground">Painel Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60'
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Ver site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50 lg:hidden flex flex-col"
            >
              <div className="flex justify-end p-3">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-card/80 backdrop-blur-sm border-b border-border/60 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-surface-hover transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-foreground">
                {currentPage?.label ?? 'Dashboard'}
              </h1>
              <p className="text-xs text-muted-foreground">{clientConfig.company.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium">{user?.name ?? 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-black flex-shrink-0 text-primary-foreground shadow-glow">
              {(user?.name ?? 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
