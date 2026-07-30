import { lazy, Suspense } from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { SmoothScrollProvider } from '@/components/scroll/SmoothScroll';
import Index from './pages/Index';

// Rotas fora da home carregam sob demanda — reduz o JS que o visitante
// da loja precisa baixar/executar no primeiro acesso (a home é o que importa).
const NotFound          = lazy(() => import('./pages/NotFound'));
const Checkout          = lazy(() => import('./pages/Checkout'));
const ProductDetail     = lazy(() => import('./pages/ProductDetail'));
const Products          = lazy(() => import('./pages/Products'));
const About             = lazy(() => import('./pages/About'));
const Contact           = lazy(() => import('./pages/Contact'));
const Services          = lazy(() => import('./pages/Services'));
const AdminLogin        = lazy(() => import('./pages/admin/Login'));
const AdminDashboard    = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts     = lazy(() => import('./pages/admin/Products'));
const AdminContent      = lazy(() => import('./pages/admin/Content'));
const AdminBanners      = lazy(() => import('./pages/admin/Banners'));
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials'));
const AdminInstagram    = lazy(() => import('./pages/admin/Instagram'));
const AdminChatbot      = lazy(() => import('./pages/admin/Chatbot'));
const AdminAnalytics    = lazy(() => import('./pages/admin/Analytics'));
const AdminThemeEditor  = lazy(() => import('./pages/admin/ThemeEditor'));
const AdminPayments     = lazy(() => import('./pages/admin/Payments'));
const AdminOrders       = lazy(() => import('./pages/admin/Orders'));
const AdminSEO          = lazy(() => import('./pages/admin/SEO'));
const AdminSettings     = lazy(() => import('./pages/admin/Settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(240,6%,11%)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'hsla(43,96%,52%,0.3)', borderTopColor: 'transparent' }} />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner richColors position="top-right" />
        <BrowserRouter>
          <SmoothScrollProvider>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/produtos/:slug" element={<ProductDetail />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/assistencia-tecnica" element={<Services />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/instagram" element={<AdminInstagram />} />
            <Route path="/admin/chatbot" element={<AdminChatbot />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/seo" element={<AdminSEO />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/theme" element={<AdminThemeEditor />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </SmoothScrollProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
