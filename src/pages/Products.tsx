import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageCircle, Search, X, GitCompareArrows, PackageSearch } from 'lucide-react';
import { useProductStore } from '@/lib/stores/productStore';
import { SimpleProductCard } from '@/components/site/SimpleProductCard';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { clientConfig } from '@/config/client';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { slugify } from '@/lib/utils/slugify';
import { conditionLabel } from '@/lib/utils/productFallbacks';

type SortKey = 'relevance' | 'price-asc' | 'price-desc';

const CATEGORY_LABELS: Record<string, string> = {
  apple: 'iPhone', xiaomi: 'Xiaomi', smartwatch: 'Smartwatches', accessory: 'Acessórios',
};

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchProducts, getActiveProducts, isLoading } = useProductStore();
  const [category, setCategory] = useState(() => searchParams.get('categoria')?.toLowerCase().trim() || 'all');
  const [condition, setCondition] = useState('all');
  const [sort, setSort] = useState<SortKey>('relevance');
  const [query, setQuery] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    document.title = `Produtos | ${clientConfig.company.name} ${clientConfig.company.nameHighlight}`;
  }, []);

  const allProducts = getActiveProducts();

  // Normaliza maiúsculas/minúsculas — cadastro manual no admin não garante
  // consistência ("apple" vs "Apple"), então dedupe e filtra por versão lowercase.
  const categories = useMemo(() => {
    const present = new Set(allProducts.map(p => p.category?.toLowerCase().trim()).filter(Boolean) as string[]);
    return Array.from(present);
  }, [allProducts]);

  // Mesma lógica — as opções de condição vêm do que os produtos de fato têm cadastrado,
  // não de uma lista fixa (o admin pode ter criado "usado", "recondicionado" etc.).
  const conditions = useMemo(() => {
    const present = new Set(allProducts.map(p => p.condition?.toLowerCase().trim()).filter(Boolean) as string[]);
    return Array.from(present);
  }, [allProducts]);

  const hasConditionData = conditions.length > 0;

  const filtered = useMemo(() => {
    let list = allProducts;
    if (category !== 'all') list = list.filter(p => p.category?.toLowerCase().trim() === category);
    if (condition !== 'all') list = list.filter(p => p.condition?.toLowerCase().trim() === condition);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.sort_order - b.sort_order);
    return sorted;
  }, [allProducts, category, condition, query, sort]);

  const clearFilters = () => { setCategory('all'); setCondition('all'); setQuery(''); setSort('relevance'); };
  const hasActiveFilters = category !== 'all' || condition !== 'all' || query.trim() !== '' || sort !== 'relevance';

  const toggleCompare = (id: string) => {
    setCompareIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  return (
    <div className="min-h-screen" style={{ background: '#fff', color: '#111' }}>
      <Header />
      <main className="pt-24 pb-20 px-5 sm:px-6 max-w-[1320px] mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <nav className="text-xs mb-6" style={{ color: '#888' }}>
            <a href="/" className="hover:text-black transition-colors">Início</a>
            <span className="mx-2">/</span>
            <span style={{ color: '#111' }}>Produtos</span>
          </nav>

          <h1 className="font-display font-bold tracking-tight mb-3 text-[clamp(1.8rem,3vw,2.6rem)]" style={{ color: '#111' }}>
            Catálogo disponível agora
          </h1>
          <p className="text-sm mb-8 max-w-lg" style={{ color: '#666' }}>
            iPhones, smartphones Xiaomi, smartwatches e acessórios originais
            com garantia, parcelamento facilitado e atendimento direto em {clientConfig.company.location.city}.
          </p>

          {/* Busca + ordenação */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#999' }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar modelo..."
                className="w-full pl-10 pr-9 py-2.5 rounded-full text-sm focus:outline-none transition-colors"
                style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#111' }}
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Limpar busca">
                  <X className="w-3.5 h-3.5" style={{ color: '#999' }} />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="px-4 py-2.5 rounded-full text-xs font-semibold focus:outline-none"
              style={{ background: '#fafafa', border: '1px solid #e5e5e5', color: '#444' }}
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button onClick={() => setCategory('all')}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{ background: category === 'all' ? '#111' : '#fff', color: category === 'all' ? '#fff' : '#555', border: `1px solid ${category === 'all' ? '#111' : '#e5e5e5'}` }}>
              Todos
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{ background: category === cat ? '#111' : '#fff', color: category === cat ? '#fff' : '#555', border: `1px solid ${category === cat ? '#111' : '#e5e5e5'}` }}>
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
            {hasConditionData && (
              <>
                <span className="w-px h-4 mx-1" style={{ background: '#e5e5e5' }} />
                <button onClick={() => setCondition('all')}
                  className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                  style={{ background: condition === 'all' ? '#f2f2f2' : '#fff', color: condition === 'all' ? '#111' : '#888', border: `1px solid ${condition === 'all' ? '#ccc' : '#e5e5e5'}` }}>
                  Qualquer condição
                </button>
                {conditions.map(c => (
                  <button key={c} onClick={() => setCondition(c)}
                    className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                    style={{ background: condition === c ? '#f2f2f2' : '#fff', color: condition === c ? '#111' : '#888', border: `1px solid ${condition === c ? '#ccc' : '#e5e5e5'}` }}>
                    {conditionLabel({ condition: c })}
                  </button>
                ))}
              </>
            )}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="hover-underline px-2 py-2 text-xs font-semibold" style={{ color: '#888' }}>
                Limpar filtros
              </button>
            )}
          </div>

          <p className="text-xs mb-8" style={{ color: '#999' }}>
            {isLoading ? 'Carregando...' : `${filtered.length} ${filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`}
          </p>

          {/* Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: '#999' }}>Carregando catálogo...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((product, i) => (
                <SimpleProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  compareChecked={compareIds.includes(product.id)}
                  onCompareToggle={() => toggleCompare(product.id)}
                  compareDisabled={compareIds.length >= 3}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
              <PackageSearch className="w-10 h-10 mx-auto mb-3" style={{ color: '#ccc' }} />
              <p className="text-sm font-bold mb-1" style={{ color: '#111' }}>Nenhum produto encontrado</p>
              <p className="text-xs mb-5" style={{ color: '#888' }}>Tente outro termo ou remova alguns filtros.</p>
              <button onClick={clearFilters} className="hover-underline text-xs font-semibold" style={{ color: '#111' }}>
                Limpar filtros
              </button>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-14">
            <p className="text-sm mb-4" style={{ color: '#888' }}>
              Não encontrou o modelo que procura?
            </p>
            <PremiumButton
              href={`https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de consultar modelos disponíveis.')}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="px-6 py-3 text-sm"
            >
              <MessageCircle className="w-4 h-4" /> Consultar mais modelos
            </PremiumButton>
          </div>
        </motion.div>
      </main>
      <Footer />

      {/* Barra flutuante de comparação */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-center gap-4"
            style={{ background: '#fff', backdropFilter: 'blur(12px)', borderTop: '1px solid #e5e5e5', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
            <span className="text-xs font-semibold" style={{ color: '#444' }}>
              {compareIds.length} {compareIds.length === 1 ? 'produto selecionado' : 'produtos selecionados'} (até 3)
            </span>
            <PremiumButton
              onClick={() => navigate(`/comparar?ids=${compareIds.join(',')}`)}
              variant="primary"
              className="px-4 py-2 text-xs"
              disabled={compareIds.length < 2}
            >
              <GitCompareArrows className="w-3.5 h-3.5" /> Comparar
            </PremiumButton>
            <button onClick={() => setCompareIds([])} className="text-xs" style={{ color: '#888' }}>Limpar</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* JSON-LD ItemList */}
      {!isLoading && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Produtos ${clientConfig.company.name} ${clientConfig.company.nameHighlight}`,
          itemListElement: allProducts.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://andinhoimports.vercel.app/produtos/${slugify(p.title)}`,
            name: p.title,
          })),
        })}} />
      )}
    </div>
  );
}
