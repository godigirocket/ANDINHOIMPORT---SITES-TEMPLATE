import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { ProductTiltCard } from '@/components/3d/ProductTiltCard';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { clientConfig } from '@/config/client';

export default function Products() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    document.title = `Produtos | ${clientConfig.company.name} ${clientConfig.company.nameHighlight}`;
  }, []);

  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="min-h-screen" style={{ background: '#050505', color: '#f7f7f7' }}>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          {/* Breadcrumb */}
          <nav className="text-xs mb-6" style={{ color: '#888' }}>
            <a href="/" className="hover:text-white transition-colors">Início</a>
            <span className="mx-2">/</span>
            <span style={{ color: '#F5B700' }}>Produtos</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-black mb-3">
            <span className="text-white">Nossos </span>
            <span style={{ color: '#F5B700' }}>Produtos</span>
          </h1>
          <p className="text-sm mb-8 max-w-lg" style={{ color: '#a6a6aa' }}>
            iPhones, smartphones Xiaomi, smartwatches e acessórios originais
            com garantia, parcelamento facilitado e atendimento direto em {clientConfig.company.location.city}.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: filter === cat.id ? '#F5B700' : 'rgba(255,255,255,0.04)',
                  color: filter === cat.id ? '#050505' : '#a6a6aa',
                  border: `1px solid ${filter === cat.id ? '#F5B700' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
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

          {/* CTA */}
          <div className="text-center mt-14">
            <p className="text-sm mb-4" style={{ color: '#888' }}>
              Não encontrou o modelo que procura?
            </p>
            <a
              href={`https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de consultar modelos disponíveis.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              <MessageCircle className="w-4 h-4" /> Consultar mais modelos
            </a>
          </div>
        </motion.div>
      </main>
      <Footer />

      {/* JSON-LD ItemList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Produtos Andinho Import',
        itemListElement: PRODUCTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://andinhoimports.vercel.app/produtos/${p.slug}`,
          name: `${p.title} ${p.storage}`,
        })),
      })}} />
    </div>
  );
}
