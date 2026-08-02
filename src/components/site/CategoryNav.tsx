import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/lib/stores/productStore';

const CATEGORY_LABELS: Record<string, string> = {
  apple: 'iPhone',
  xiaomi: 'Xiaomi',
  smartwatch: 'Smartwatches',
  accessory: 'Acessórios',
};

/** Atalhos de categoria — mesma ideia do menu por categoria do site de referência. */
export function CategoryNav() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const categories = useMemo(() => {
    const present = new Set(
      products.filter(p => p.status === 'active').map(p => p.category?.toLowerCase().trim()).filter(Boolean) as string[]
    );
    return Array.from(present);
  }, [products]);

  if (categories.length === 0) return null;

  return (
    <nav className="w-full overflow-x-auto" style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-center gap-2 px-5 py-4 min-w-max mx-auto">
        {categories.map(cat => (
          <Link key={cat} to={`/produtos?categoria=${encodeURIComponent(cat)}`}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.15)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(43,96%,52%)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </Link>
        ))}
        <Link to="/produtos"
          className="px-4 py-2 rounded-full text-sm font-semibold"
          style={{ color: 'hsl(43,96%,52%)' }}>
          Ver tudo
        </Link>
      </div>
    </nav>
  );
}
