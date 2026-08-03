import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/lib/stores/productStore';
import { clientConfig } from '@/config/client';
import { SimpleProductCard } from '@/components/site/SimpleProductCard';

export function SimpleCatalogSection() {
  const { fetchProducts, getActiveProducts, isLoading } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const products = getActiveProducts();

  if (!clientConfig.features.products) return null;

  return (
    <section id="products" className="relative py-9 md:py-16 overflow-hidden" style={{ background: '#fff' }}>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6 min-w-0">
          <h2 className="text-lg sm:text-xl font-black tracking-tight min-w-0" style={{ color: '#111' }}>Modelos disponiveis</h2>
          <Link to="/produtos" className="hover-underline text-sm shrink-0" style={{ color: '#555' }}>Ver todos</Link>
        </div>

        {isLoading ? (
          <p className="text-sm py-10" style={{ color: '#888' }}>Carregando...</p>
        ) : products.length === 0 ? (
          <p className="text-sm py-10" style={{ color: '#888' }}>Nenhum produto cadastrado.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 min-w-0">
            {products.slice(0, 10).map((product, i) => (
              <SimpleProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
