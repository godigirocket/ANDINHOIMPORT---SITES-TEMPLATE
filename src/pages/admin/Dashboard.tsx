import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, PackageCheck, ArrowRight, Plus, ExternalLink, AlertCircle, TrendingUp, Users, ShoppingCart, DollarSign, Eye, Clock, Zap, Star, MousePointerClick, Globe, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProductStore } from '@/lib/stores/productStore';
import { useNavigate } from 'react-router-dom';
import { clientConfig } from '@/config/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { OnboardingChecklist } from '@/components/admin/OnboardingChecklist';

// Contador de visitas persistente
const VISITS_KEY = `${clientConfig.id}_visit_stats`;

interface VisitStats {
  total: number;
  today: number;
  todayDate: string;
  lastWeek: number[];
}

function getVisitStats(): VisitStats {
  try {
    const raw = localStorage.getItem(VISITS_KEY);
    if (!raw) return { total: 0, today: 0, todayDate: '', lastWeek: [0,0,0,0,0,0,0] };
    return JSON.parse(raw);
  } catch { return { total: 0, today: 0, todayDate: '', lastWeek: [0,0,0,0,0,0,0] }; }
}

function recordVisit() {
  const stats = getVisitStats();
  const today = new Date().toISOString().split('T')[0];
  
  if (stats.todayDate !== today) {
    // Novo dia — rotaciona a semana
    stats.lastWeek = [...stats.lastWeek.slice(1), stats.today];
    stats.today = 1;
    stats.todayDate = today;
  } else {
    stats.today++;
  }
  stats.total++;
  localStorage.setItem(VISITS_KEY, JSON.stringify(stats));
  return stats;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, fetchProducts, getActiveProducts, hasSupabase } = useProductStore();
  const [time, setTime] = useState(new Date());
  const [visits, setVisits] = useState<VisitStats>(getVisitStats());

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  
  // Relógio em tempo real
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeProducts = getActiveProducts();
  const fmt = (p: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p);
  const totalValue = activeProducts.reduce((sum, p) => sum + p.price, 0);

  const stats = [
    { label: 'Produtos Ativos', value: activeProducts.length, icon: PackageCheck, color: 'text-primary', bg: 'hsla(43,96%,52%,0.1)', border: 'hsla(43,96%,52%,0.2)' },
    { label: 'Valor em Catálogo', value: fmt(totalValue), icon: DollarSign, color: 'text-green-400', bg: 'hsla(142,71%,45%,0.08)', border: 'hsla(142,71%,45%,0.2)' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Aviso de Supabase não configurado */}
        {!hasSupabase && (
          <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'hsla(25,95%,53%,0.1)', border: '1px solid hsla(25,95%,53%,0.3)' }}>
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-orange-400">Banco de dados não configurado</p>
              <p className="text-xs mt-1" style={{ color: 'hsla(45,20%,96%,0.6)' }}>
                Os dados estão sendo salvos apenas localmente neste navegador. Configure o Supabase em Configurações para garantir que produtos e pedidos não se percam.
              </p>
            </div>
          </div>
        )}
        {/* Header com relógio */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Dashboard</h1>
            <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
              Bem-vindo ao painel da {clientConfig.company.name} {clientConfig.company.nameHighlight}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary tabular-nums">
              {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.4)' }}>
              {time.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* Onboarding checklist */}
        <OnboardingChecklist />

        {/* Stats grid com animações */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.07 }}>
              <div className="rounded-2xl p-5 transition-all duration-300 relative overflow-hidden group"
                style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${stat.bg}, transparent 70%)` }} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold" style={{ color: 'hsla(45,20%,96%,0.5)' }}>{stat.label}</p>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl p-6"
          style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
          <h2 className="text-sm font-bold text-white mb-4">Ações Rápidas</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'Novo Produto', desc: 'Adicionar ao catálogo', icon: Plus, action: () => navigate('/admin/products'), primary: true },
              { label: 'Editar Conteúdo', desc: 'Textos e links do site', icon: ExternalLink, action: () => navigate('/admin/content'), primary: false },
              { label: 'Ver Site', desc: 'Abrir landing page', icon: ExternalLink, action: () => window.open('/', '_blank'), primary: false },
            ].map((action, i) => (
              <motion.button key={action.label}
                initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                onClick={action.action}
                className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200"
                style={{
                  background: action.primary ? 'hsla(43,96%,52%,0.1)' : 'hsla(220,20%,10%,0.8)',
                  border: `1px solid ${action.primary ? 'hsla(43,96%,52%,0.3)' : 'hsla(255,255%,255%,0.06)'}`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: action.primary ? 'linear-gradient(135deg,hsl(43,96%,52%),hsl(38,92%,44%))' : 'hsla(220,20%,14%,1)' }}>
                  <action.icon className="w-4 h-4" style={{ color: action.primary ? 'hsl(220,20%,4%)' : 'hsla(45,20%,96%,0.6)' }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{action.label}</p>
                  <p className="text-xs" style={{ color: 'hsla(45,20%,96%,0.4)' }}>{action.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'hsla(220,20%,7%,0.8)', border: '1px solid hsla(43,96%,52%,0.1)' }}>
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid hsla(255,255%,255%,0.05)' }}>
            <h2 className="text-sm font-bold text-white">Produtos Recentes</h2>
            <button onClick={() => navigate('/admin/products')}
              className="flex items-center gap-1.5 text-xs text-primary hover:opacity-80 transition-opacity">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-4 space-y-2">
            {products.length > 0 ? products.slice(0, 6).map(product => (
              <div key={product.id}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                style={{ background: 'hsla(220,20%,9%,0.6)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'hsla(220,20%,11%,0.8)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'hsla(220,20%,9%,0.6)')}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, hsla(43,96%,52%,0.15), hsla(200,100%,60%,0.1))' }}>
                  {product.image_url
                    ? <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    : <Package className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{product.title}</p>
                  <p className="text-xs text-primary">{fmt(product.price)}</p>
                </div>
                <Badge variant="outline"
                  className={`text-xs flex-shrink-0 ${product.status === 'active' ? 'border-green-500/30 text-green-400 bg-green-500/8' : 'border-white/10 text-white/40'}`}>
                  {product.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            )) : (
              <div className="text-center py-10">
                <Package className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsla(43,96%,52%,0.3)' }} />
                <p className="text-sm mb-4" style={{ color: 'hsla(45,20%,96%,0.4)' }}>Nenhum produto cadastrado</p>
                <button onClick={() => navigate('/admin/products')} className="btn-gold text-xs px-5 py-2">
                  <Plus className="w-3.5 h-3.5 mr-1.5 inline" />
                  Adicionar Produto
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
