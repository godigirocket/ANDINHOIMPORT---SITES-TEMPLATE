import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '@/lib/stores/productStore';
import { clientConfig } from '@/config/client';
import { RevealText } from '@/components/ui/RevealText';
import { TiltCard } from '@/components/ui/TiltCard';
import { PremiumButton } from '@/components/ui/PremiumButton';

export function ProductsSection() {
  const navigate = useNavigate();
  const { fetchProducts, getActiveProducts, isLoading } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const products = getActiveProducts();

  if (!clientConfig.features.products) return null;

  return (
    <section id="products" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(240,6%,11%) 0%, hsl(213,24%,15%) 50%, hsl(240,6%,11%) 100%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <RevealText as="h2" className="font-black text-3xl md:text-5xl tracking-tight mb-3">
            <span className="text-white">Nossos </span>
            <span className="gradient-text">Produtos</span>
          </RevealText>
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xs md:text-sm max-w-md mx-auto" style={{ color: '#777' }}>
            Modelos selecionados com garantia e parcelamento.
          </motion.p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: '#888' }}>Carregando...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => {
              const waUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(`Olá! Tenho interesse no ${product.title}. Pode me passar mais informações?`)}`;
              return (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard
                  className="overflow-hidden cursor-pointer group relative"
                  style={{ background: 'hsl(213,20%,19%)', border: '1px solid rgba(245,183,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
                  onClick={() => window.open(waUrl, '_blank')}
                >
                  {/* Imagem */}
                  <div className="aspect-[4/3] overflow-hidden relative flex items-center justify-center" style={{ background: 'hsl(213,18%,16%)' }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title}
                        className="product-reflect w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: 'hsl(213,16%,15%)' }}>
                        <span className="text-xs" style={{ color: '#666' }}>Sem imagem</span>
                      </div>
                    )}
                    {/* Shimmer on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: 'linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.05) 50%, transparent 80%)' }} />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
                        style={{ background: 'hsl(43,96%,52%)', color: '#050505', boxShadow: '0 2px 8px rgba(245,183,0,0.3)' }}>
                        {product.badge.replace(/[^\w\sÀ-ú]/g, '').trim()}
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-xs mb-3 line-clamp-1" style={{ color: '#999' }}>{product.description}</p>
                    )}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-lg font-black" style={{ color: 'hsl(43,96%,52%)' }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </span>
                      {product.old_price && (
                        <span className="text-xs line-through" style={{ color: '#666' }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.old_price)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] mb-4" style={{ color: '#888' }}>
                      ou {product.installments}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / product.installments)}
                    </p>
                    <PremiumButton
                      variant="primary"
                      className="w-full py-2.5 text-xs"
                      onClick={(e) => { e.stopPropagation(); window.open(waUrl, '_blank'); }}
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Consultar
                    </PremiumButton>
                  </div>
                </TiltCard>
              </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: '#888' }}>Nenhum produto cadastrado.</p>
          </div>
        )}

        {/* CTA bottom */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <PremiumButton
            href={`https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de ver mais modelos disponíveis.')}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            className="text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Ver mais modelos no WhatsApp
          </PremiumButton>
        </motion.div>
      </div>
    </section>
  );
}
