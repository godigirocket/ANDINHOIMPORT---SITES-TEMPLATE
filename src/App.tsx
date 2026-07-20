import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth/AuthContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminContent from './pages/admin/Content';
import AdminBanners from './pages/admin/Banners';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminInstagram from './pages/admin/Instagram';
import AdminChatbot from './pages/admin/Chatbot';
import AdminAnalytics from './pages/admin/Analytics';
import AdminThemeEditor from './pages/admin/ThemeEditor';
import AdminPayments from './pages/admin/Payments';
import AdminOrders from './pages/admin/Orders';
import AdminSEO from './pages/admin/SEO';
import AdminSettings from './pages/admin/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner richColors position="top-right" />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
