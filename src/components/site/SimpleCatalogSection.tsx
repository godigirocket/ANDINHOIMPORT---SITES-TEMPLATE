import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/lib/stores/productStore';
import { clientConfig } from '@/config/client';
import { SimpleProductCard } from '@/components/site/SimpleProductCard';

/**
 * Catálogo simples — fundo branco, cartão fino, sem TiltCard nem motion
 * pesado. É a "loja normal" depois da vitrine em preto do Hero.
 */
export function SimpleCatalogSection() {
  const { fetchProducts, getActiveProducts, isLoading } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const products = getActiveProducts();

  if (!clientConfig.features.products) return null;

  return (
    <section id="products" className="relative py-12 md:py-16" style={{ background: '#fff' }}>
      <div className="max-w-[1320px] mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ color: '#111' }}>Modelos disponíveis</h2>
          <Link to="/produtos" className="hover-underline text-sm" style={{ color: '#555' }}>Ver todos</Link>
        </div>

        {isLoading ? (
          <p className="text-sm py-10" style={{ color: '#888' }}>Carregando…</p>
        ) : products.length === 0 ? (
          <p className="text-sm py-10" style={{ color: '#888' }}>Nenhum produto cadastrado.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.slice(0, 10).map((product, i) => (
              <SimpleProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
