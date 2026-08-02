import { useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useProductStore } from '@/lib/stores/productStore';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { clientConfig } from '@/config/client';
import { RevealText } from '@/components/ui/RevealText';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { slugify } from '@/lib/utils/slugify';
import {
  safeImageUrl, priceLabel, conditionLabel, storageLabel, batteryLabel,
  colorLabel, warrantyLabel, accessoriesLabel, whatsappUrlForProduct,
} from '@/lib/utils/productFallbacks';

const ROWS: { label: string; get: (p: ReturnType<typeof useProductStore.getState>['products'][number]) => string }[] = [
  { label: 'Preço', get: p => priceLabel(p.price) },
  { label: 'Parcelamento', get: p => `${p.installments}x de ${priceLabel(p.price / p.installments)}` },
  { label: 'Condição', get: p => conditionLabel(p) },
  { label: 'Armazenamento', get: p => storageLabel(p) },
  { label: 'Cor', get: p => colorLabel(p) },
  { label: 'Saúde da bateria', get: p => batteryLabel(p) },
  { label: 'Garantia', get: p => warrantyLabel(p) },
  { label: 'Acessórios', get: p => accessoriesLabel(p) },
];

export default function Compare() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { document.title = `Comparar produtos | ${clientConfig.company.name}`; }, []);

  const ids = useMemo(() => (params.get('ids') || '').split(',').filter(Boolean), [params]);
  const selected = ids.map(id => products.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);

  const removeOne = (id: string) => {
    const next = ids.filter(x => x !== id);
    setParams(next.length ? { ids: next.join(',') } : {});
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(240,6%,11%)', color: '#f7f7f7' }}>
      <Header />
      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <nav className="text-xs mb-6" style={{ color: '#888' }}>
          <Link to="/" className="hover:text-white transition-colors">Início</Link>
          <span className="mx-2">/</span>
          <Link to="/produtos" className="hover:text-white transition-colors">Produtos</Link>
          <span className="mx-2">/</span>
          <span style={{ color: '#F5B700' }}>Comparar</span>
        </nav>

        <RevealText as="h1" className="font-display font-bold tracking-tight mb-10 text-white text-[clamp(1.8rem,3vw,2.6rem)]">
          Comparar modelos lado a lado
        </RevealText>

        {isLoading ? (
          <p className="text-sm" style={{ color: '#888' }}>Carregando...</p>
        ) : selected.length < 2 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: 'hsla(213,18%,16%,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-sm font-bold text-white mb-2">Escolha pelo menos 2 produtos pra comparar</p>
            <p className="text-xs mb-5" style={{ color: '#888' }}>Volte ao catálogo e marque a caixinha "Comparar" nos aparelhos que quer ver lado a lado.</p>
            <PremiumButton onClick={() => navigate('/produtos')} variant="primary" className="px-6 py-3 text-sm">
              Ver catálogo
            </PremiumButton>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto -mx-4 px-4">
            <div className="grid gap-4 min-w-[600px]" style={{ gridTemplateColumns: `140px repeat(${selected.length}, 1fr)` }}>
              {/* Header row: imagem + nome + remover */}
              <div />
              {selected.map(p => (
                <div key={p.id} className="rounded-2xl p-4 text-center relative" style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(245,183,0,0.1)' }}>
                  <button onClick={() => removeOne(p.id)} aria-label={`Remover ${p.title}`}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/5 transition-colors">
                    <X className="w-3.5 h-3.5" style={{ color: '#888' }} />
                  </button>
                  <img src={safeImageUrl(p.image_url)} alt={p.title} className="w-full aspect-square object-contain mb-2" />
                  <Link to={`/produtos/${slugify(p.title)}`} className="hover-underline text-xs font-bold text-white block mb-3 line-clamp-2">
                    {p.title}
                  </Link>
                  <PremiumButton href={whatsappUrlForProduct(p)} target="_blank" rel="noopener noreferrer" variant="primary" className="w-full py-2 text-[11px]">
                    <MessageCircle className="w-3 h-3" /> Consultar
                  </PremiumButton>
                </div>
              ))}

              {/* Rows */}
              {ROWS.map((row, i) => (
                <>
                  <div key={`${row.label}-label`} className="flex items-center text-xs font-semibold py-3" style={{ color: '#888', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
                    {row.label}
                  </div>
                  {selected.map(p => (
                    <div key={`${row.label}-${p.id}`} className="flex items-center justify-center text-xs py-3 text-center"
                      style={{ color: '#eee', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
                      {row.get(p)}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
