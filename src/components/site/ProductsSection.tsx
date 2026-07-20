import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES, type ProductData, getWhatsAppUrl } from '@/data/products';
import { ProductTiltCard } from '@/components/3d/ProductTiltCard';
import { clientConfig } from '@/config/client';

export function ProductsSection() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeFilter);

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

        {/* Filters */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: activeFilter === cat.id ? '#F5B700' : 'rgba(255,255,255,0.04)',
                color: activeFilter === cat.id ? '#050505' : '#a6a6aa',
                border: `1px solid ${activeFilter === cat.id ? '#F5B700' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <ProductTiltCard
                key={product.id}
                product={product}
                index={i}
                onClick={() => navigate(`/produtos/${product.slug}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: '#888' }}>Nenhum produto nesta categoria.</p>
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
