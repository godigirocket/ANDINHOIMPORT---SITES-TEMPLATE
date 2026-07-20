import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '@/lib/stores/productStore';
import { clientConfig } from '@/config/client';

export function ProductsSection() {
  const navigate = useNavigate();
  const { fetchProducts, getActiveProducts, isLoading } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const products = getActiveProducts();

  if (!clientConfig.features.products) return null;

  return (
    <section id="products" className="relative py-20 md:py-28">
      <div className="absolute inset-0" style={{ background: '#050505' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-black text-3xl md:text-5xl tracking-tight mb-3">
            <span className="text-white">Nossos </span>
            <span style={{ color: '#F5B700' }}>Produtos</span>
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#a6a6aa' }}>
            Modelos selecionados, condições facilitadas e atendimento direto.
          </p>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: '#888' }}>Carregando...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <motion.div key={product.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="rounded-2xl overflow-hidden cursor-pointer group relative"
                style={{ background: '#141416', border: '1px solid rgba(245,183,0,0.08)' }}
                onClick={() => {
                  const wa = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(`Olá! Tenho interesse no ${product.title}. Pode me passar mais informações?`)}`;
                  window.open(wa, '_blank');
                }}
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(245,183,0,0.1), 0 0 20px rgba(245,183,0,0.05)' }} />

                {/* Imagem */}
                <div className="aspect-square overflow-hidden relative" style={{ background: '#1a1a1e' }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title}
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                      loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs" style={{ color: '#444' }}>Sem imagem</span>
                    </div>
                  )}
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{ background: 'hsl(43,96%,52%)', color: '#050505' }}>
                      {product.badge}
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
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all group-hover:shadow-lg"
                    style={{ background: 'hsl(43,96%,52%)', color: '#050505', boxShadow: '0 4px 12px rgba(245,183,0,0.2)' }}>
                    <MessageCircle className="w-3.5 h-3.5" /> Consultar
                  </button>
                </div>
              </motion.div>
            ))}
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
          <a
            href={`https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de ver mais modelos disponíveis.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
            style={{
              border: '1px solid rgba(245,183,0,0.3)',
              color: '#F5B700',
              background: 'rgba(245,183,0,0.05)',
            }}
          >
            <MessageCircle className="w-4 h-4" />
            Ver mais modelos no WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
