import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MessageCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductStore } from '@/lib/stores/productStore';
import { useContentStore } from '@/lib/stores/contentStore';
import { clientConfig } from '@/config/client';

export function ProductsSection() {
  const { products, fetchProducts, getActiveProducts } = useProductStore();
  const { content } = useContentStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const activeProducts = getActiveProducts();
  const { products: productsContent } = content;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleProductClick = (productTitle: string) => {
    const message = encodeURIComponent(`Olá! Tenho interesse no ${productTitle}. Pode me passar mais informações?`);
    window.open(`${clientConfig.company.contact.whatsapp}?text=${message}`, '_blank');
  };

  if (!clientConfig.features.products) return null;

  return (
    <section id="products" className="py-20 md:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-transparent" />
      
      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            <span className="gradient-text">{productsContent?.title || 'Modelos Disponíveis'}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira nossos produtos disponíveis para pronta entrega
          </p>
        </motion.div>

        {/* Products Grid */}
        {activeProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="glass-card overflow-hidden hover-lift">
                  {/* Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl opacity-50">📱</div>
                    )}
                    
                    {/* Badge */}
                    {product.badge && (
                      <Badge className="absolute top-3 right-3 gradient-primary border-0">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-2xl font-black text-accent">
                        {formatPrice(product.price)}
                      </div>
                      {clientConfig.features.installments && product.installments > 1 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CreditCard className="w-4 h-4" />
                          <span>ou {product.installments}x de {formatPrice(product.price / product.installments)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* CTA */}
                    <Button 
                      onClick={() => handleProductClick(product.title)}
                      className="w-full gradient-accent"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Consultar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-surface mx-auto flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">{productsContent?.emptyState?.title || 'Nenhum produto disponível'}</h3>
            <p className="text-muted-foreground mb-6">{productsContent?.emptyState?.description || 'Em breve teremos novidades!'}</p>
            <Button onClick={() => window.open(clientConfig.company.contact.whatsapp, '_blank')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Consultar disponibilidade
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
