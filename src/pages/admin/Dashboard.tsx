import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, TrendingUp, CreditCard, Plus, ExternalLink, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/lib/stores/productStore';
import { useNavigate } from 'react-router-dom';
import { clientConfig } from '@/config/client';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, fetchProducts, getActiveProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const activeProducts = getActiveProducts();

  const stats = [
    {
      title: 'Produtos Ativos',
      value: activeProducts.length.toString(),
      icon: Package,
      color: 'primary',
      change: '+2 esta semana'
    },
    {
      title: 'Total de Produtos',
      value: products.length.toString(),
      icon: Users,
      color: 'accent',
      change: 'Catálogo completo'
    },
    {
      title: 'Seguidores Instagram',
      value: '2.5K+',
      icon: TrendingUp,
      color: 'primary',
      change: '+150 este mês'
    },
    {
      title: 'Taxa de Conversão',
      value: '85%',
      icon: CreditCard,
      color: 'accent',
      change: '+5% vs mês anterior'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Produto',
      description: 'Adicionar item ao catálogo',
      icon: Package,
      action: () => navigate('/admin/products'),
      variant: 'primary' as const
    },
    {
      title: 'Editar Conteúdo',
      description: 'Atualizar textos do site',
      icon: ExternalLink,
      action: () => navigate('/admin/content'),
      variant: 'secondary' as const
    },
    {
      title: 'Ver Site',
      description: 'Visualizar landing page',
      icon: ExternalLink,
      action: () => window.open('/', '_blank'),
      variant: 'secondary' as const
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel administrativo da {clientConfig.company.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card hover-lift">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color === 'primary' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={action.action}
                  className={`flex items-center gap-4 p-4 rounded-xl border border-border/50 text-left hover-lift transition-all ${
                    action.variant === 'primary' 
                      ? 'bg-primary/10 hover:bg-primary/20' 
                      : 'bg-surface/50 hover:bg-surface-hover'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    action.variant === 'primary' 
                      ? 'gradient-primary' 
                      : 'bg-surface'
                  }`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Produtos Recentes</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
              Ver todos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="space-y-3">
                {products.slice(0, 5).map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-surface/50 hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' 
                        ? 'bg-accent/20 text-accent' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {product.status === 'active' ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Nenhum produto cadastrado</p>
                <Button onClick={() => navigate('/admin/products')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
