import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, PackageCheck, ArrowRight, Plus, ExternalLink, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProductStore } from '@/lib/stores/productStore';
import { useNavigate } from 'react-router-dom';
import { clientConfig } from '@/config/client';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, fetchProducts, getActiveProducts, hasSupabase } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const activeProducts = getActiveProducts();
  const fmt = (p: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p);

  const stats = [
    { label: 'Produtos Ativos', value: activeProducts.length, icon: PackageCheck, color: 'text-primary', bg: 'hsla(43,96%,52%,0.1)', border: 'hsla(43,96%,52%,0.2)' },
    { label: 'Total no Catálogo', value: products.length, icon: Package, color: 'text-blue-400', bg: 'hsla(200,100%,60%,0.08)', border: 'hsla(200,100%,60%,0.2)' },
    { label: 'Inativos', value: products.length - activeProducts.length, icon: TrendingUp, color: 'text-purple-400', bg: 'hsla(280,80%,65%,0.08)', border: 'hsla(280,80%,65%,0.2)' },
    { label: 'Seguidores', value: '2.5K+', icon: Users, color: 'text-green-400', bg: 'hsla(142,71%,45%,0.08)', border: 'hsla(142,71%,45%,0.2)' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
            Bem-vindo ao painel da {clientConfig.company.name} {clientConfig.company.nameHighlight}
          </p>
        </div>

        {/* Supabase warning */}
        {!hasSupabase && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'hsla(43,96%,52%,0.06)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-primary mb-1">Supabase não configurado</p>
              <p style={{ color: 'hsla(45,20%,96%,0.6)' }}>
                Dados salvos localmente. Crie <code className="px-1 rounded text-xs" style={{ background: 'hsla(43,96%,52%,0.15)' }}>.env</code> com{' '}
                <code className="px-1 rounded text-xs" style={{ background: 'hsla(43,96%,52%,0.15)' }}>VITE_SUPABASE_URL</code> e{' '}
                <code className="px-1 rounded text-xs" style={{ background: 'hsla(43,96%,52%,0.15)' }}>VITE_SUPABASE_ANON_KEY</code>.
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.07 }}>
              <div className="rounded-2xl p-5 transition-all duration-300"
                style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold" style={{ color: 'hsla(45,20%,96%,0.5)' }}>{stat.label}</p>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
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
                    ? <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
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
