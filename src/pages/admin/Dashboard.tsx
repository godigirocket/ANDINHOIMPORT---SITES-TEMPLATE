import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, DollarSign, ExternalLink, Package, PackageCheck, Plus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { clientConfig } from '@/config/client';
import { useProductStore } from '@/lib/stores/productStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, fetchProducts, getActiveProducts, hasSupabase } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const activeProducts = getActiveProducts();
  const fmt = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  const totalValue = activeProducts.reduce((sum, product) => sum + product.price, 0);

  const actions = [
    { label: 'Novo produto', desc: 'Cadastrar item no catalogo', icon: Plus, action: () => navigate('/admin/products'), primary: true },
    { label: 'CRM de leads', desc: 'Organizar contatos e vendas', icon: Users, action: () => navigate('/admin/leads') },
    { label: 'Conteudo do site', desc: 'Editar textos, banners e links', icon: ExternalLink, action: () => navigate('/admin/content') },
    { label: 'Abrir loja', desc: 'Ver a pagina publica', icon: ExternalLink, action: () => window.open('/', '_blank', 'noopener,noreferrer') },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-6">
        {!hasSupabase && (
          <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'hsla(25,95%,53%,0.1)', border: '1px solid hsla(25,95%,53%,0.28)' }}>
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-400" />
            <div>
              <p className="text-sm font-bold text-orange-400">Banco de dados nao configurado</p>
              <p className="mt-1 text-xs text-white/55">Os dados estao salvos apenas neste navegador. Configure o Supabase para manter produtos e pedidos sincronizados.</p>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-2xl font-black text-white">Painel da loja</h1>
          <p className="mt-1 text-sm text-white/45">{clientConfig.company.name} {clientConfig.company.nameHighlight}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl p-5" style={{ background: 'hsla(43,96%,52%,0.1)', border: '1px solid hsla(43,96%,52%,0.22)' }}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/52">Produtos ativos</p>
              <PackageCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-black text-primary">{activeProducts.length}</p>
          </div>

          <div className="rounded-xl p-5" style={{ background: 'hsla(142,71%,45%,0.08)', border: '1px solid hsla(142,71%,45%,0.18)' }}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/52">Valor em catalogo</p>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400">{fmt(totalValue)}</p>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'hsla(220,20%,7%,0.82)', border: '1px solid hsla(43,96%,52%,0.12)' }}>
          <h2 className="mb-4 text-sm font-bold text-white">Acoes principais</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {actions.map(action => (
              <button
                key={action.label}
                onClick={action.action}
                className="flex items-center gap-3 rounded-xl p-4 text-left transition-transform hover:-translate-y-0.5"
                style={{
                  background: action.primary ? 'hsla(43,96%,52%,0.11)' : 'hsla(255,255%,255%,0.035)',
                  border: action.primary ? '1px solid hsla(43,96%,52%,0.28)' : '1px solid hsla(255,255%,255%,0.07)',
                }}
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: action.primary ? 'hsl(43,96%,52%)' : 'hsla(255,255%,255%,0.055)' }}>
                  <action.icon className="h-4 w-4" style={{ color: action.primary ? '#08080a' : 'rgba(255,255,255,0.62)' }} />
                </span>
                <span>
                  <span className="block text-sm font-bold text-white">{action.label}</span>
                  <span className="block text-xs text-white/42">{action.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl" style={{ background: 'hsla(220,20%,7%,0.82)', border: '1px solid hsla(43,96%,52%,0.12)' }}>
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <h2 className="text-sm font-bold text-white">Produtos recentes</h2>
            <button onClick={() => navigate('/admin/products')} className="flex items-center gap-1.5 text-xs font-bold text-primary">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2 p-3">
            {products.length > 0 ? products.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center gap-3 rounded-lg bg-white/[0.035] p-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                  {product.image_url
                    ? <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    : <Package className="h-5 w-5 text-primary" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{product.title}</p>
                  <p className="text-xs text-primary">{fmt(product.price)}</p>
                </div>
                <Badge variant="outline" className={product.status === 'active' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/10 text-white/40'}>
                  {product.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            )) : (
              <div className="py-10 text-center">
                <Package className="mx-auto mb-3 h-10 w-10 text-primary/35" />
                <p className="mb-4 text-sm text-white/45">Nenhum produto cadastrado</p>
                <button onClick={() => navigate('/admin/products')} className="btn-gold px-5 py-2 text-xs">
                  Adicionar produto
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
