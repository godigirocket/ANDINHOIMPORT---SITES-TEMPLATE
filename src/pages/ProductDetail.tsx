import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Shield, Truck, CreditCard, Check, Loader2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useProductStore, type Product } from '@/lib/stores/productStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { usePaymentStore } from '@/lib/stores/paymentStore';
import { clientConfig } from '@/config/client';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { SimpleProductCard } from '@/components/site/SimpleProductCard';
import { slugify } from '@/lib/utils/slugify';
import {
  safeImageUrl, priceLabel, conditionLabel, storageLabel, batteryLabel,
  colorLabel, warrantyLabel, accessoriesLabel, descriptionOrFallback, whatsappUrlForProduct,
} from '@/lib/utils/productFallbacks';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, isLoading, fetchProducts, getActiveProducts } = useProductStore();
  const { addItem, openCart } = useCartStore();
  const { config } = usePaymentStore();
  const checkoutEnabled = config.mode === 'checkout';

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const product = products.find(p => slugify(p.title) === slug);

  useEffect(() => {
    if (product) document.title = `${product.title} | ${clientConfig.company.name}`;
  }, [product]);

  // Ainda carregando — evita mostrar "não encontrado" antes do fetch terminar
  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#F5B700' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg mb-2" style={{ color: '#111' }}>Produto não encontrado</p>
          <p className="text-sm mb-6" style={{ color: '#888' }}>Pode ter sido removido do catálogo ou o link está incorreto.</p>
          <PremiumButton onClick={() => navigate('/produtos')} variant="primary" className="px-6 py-3 text-sm">
            Ver catálogo completo
          </PremiumButton>
        </div>
      </div>
    );
  }

  const related: Product[] = getActiveProducts()
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const specs = [
    { icon: Shield, label: product.condition ? conditionLabel(product) : 'Testado antes da venda' },
    { icon: CreditCard, label: `Até ${product.installments}x sem juros` },
    { icon: Truck, label: product.status === 'active' ? 'Pronta entrega' : 'Consulte disponibilidade' },
    { icon: Check, label: 'Produto original' },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ color: '#111' }}>
      <header className="fixed top-0 w-full z-50 px-4 py-4" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #eee' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="hover-underline flex items-center gap-2 text-sm transition-colors" style={{ color: '#555' }}>
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <PremiumButton href={whatsappUrlForProduct(product)} target="_blank" rel="noopener noreferrer" variant="primary" className="px-4 py-2 text-xs">
            <MessageCircle className="w-3.5 h-3.5" /> Consultar
          </PremiumButton>
        </div>
      </header>

      <main className="pt-24 pb-20 px-5 sm:px-6 max-w-[1320px] mx-auto">
        <nav className="text-xs mb-6" style={{ color: '#999' }}>
          <Link to="/" className="hover:text-black transition-colors">Início</Link>
          <span className="mx-2">/</span>
          <Link to="/produtos" className="hover:text-black transition-colors">Produtos</Link>
          <span className="mx-2">/</span>
          <span style={{ color: '#111' }}>{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Imagem única, composição elegante — sem fingir galeria que não existe */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="lg:sticky lg:top-28">
            <div className="rounded-2xl relative overflow-hidden" style={{ background: '#fafafa', border: '1px solid #eee' }}>
              {product.badge && (
                <span className="absolute top-5 left-5 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: 'hsl(43,96%,52%)', color: '#050505' }}>
                  {product.badge}
                </span>
              )}
              <img
                src={safeImageUrl(product.image_url)}
                alt={product.title}
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-6">
            <h1 className="font-display font-bold tracking-tight text-[clamp(1.8rem,3.2vw,2.6rem)]" style={{ color: '#111' }}>
              {product.title}
            </h1>

            {/* Só mostra o que a loja de fato informou — nada de repetir "Não informado" 3x */}
            {(product.condition || product.storage_gb || product.color || product.battery_health_pct) && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: '#666' }}>
                {product.condition && <span>{conditionLabel(product)}</span>}
                {product.storage_gb && <span>{storageLabel(product)}</span>}
                {product.color && <span>{colorLabel(product)}</span>}
                {product.battery_health_pct && <span>Bateria: {batteryLabel(product)}</span>}
              </div>
            )}

            <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
              {descriptionOrFallback(product.description)}
            </p>

            {/* Price */}
            <div className="pb-6" style={{ borderBottom: '1px solid #eee' }}>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-black" style={{ color: '#111' }}>{priceLabel(product.price)}</span>
                {product.old_price && (
                  <span className="text-sm line-through" style={{ color: '#bbb' }}>{priceLabel(product.old_price)}</span>
                )}
              </div>
              <p className="text-sm mt-1" style={{ color: '#888' }}>
                ou {product.installments}x de {priceLabel(product.price / product.installments)} sem juros
              </p>
            </div>

            {/* Benefits — lista simples, sem grid de card-dentro-de-card */}
            <div className="space-y-2.5">
              {specs.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#111' }} />
                  <span className="text-sm" style={{ color: '#333' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Confiança — o que foi verificado, garantia, acessórios */}
            <div className="rounded-2xl p-5 space-y-2" style={{ background: '#fafafa', border: '1px solid #eee' }}>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#111' }}>Confiança</p>
              <p className="text-xs" style={{ color: '#777' }}>Garantia: <span style={{ color: '#111' }}>{warrantyLabel(product)}</span></p>
              <p className="text-xs" style={{ color: '#777' }}>Acessórios: <span style={{ color: '#111' }}>{accessoriesLabel(product)}</span></p>
            </div>

            {/* CTA */}
            <PremiumButton href={whatsappUrlForProduct(product)} target="_blank" rel="noopener noreferrer" variant="primary" className="w-full py-4 text-sm">
              <MessageCircle className="w-5 h-5" />
              Consultar no WhatsApp
            </PremiumButton>

            {checkoutEnabled && (
              <PremiumButton
                variant="secondary" className="w-full py-3 text-sm"
                onClick={() => { addItem(product); openCart(); toast.success(`${product.title} adicionado ao carrinho`); }}
              >
                <ShoppingBag className="w-4 h-4" />
                Adicionar ao carrinho
              </PremiumButton>
            )}

            <p className="text-center text-xs" style={{ color: '#999' }}>
              Tire dúvidas e feche negócio direto com nossa equipe
            </p>
          </motion.div>
        </div>

        {/* Relacionados — só produtos reais da mesma categoria */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display font-bold tracking-tight mb-6 text-[clamp(1.4rem,2vw,1.8rem)]" style={{ color: '#111' }}>Modelos relacionados</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <SimpleProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description ?? undefined,
        image: safeImageUrl(product.image_url),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: product.price,
          availability: product.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: product.condition === 'novo' ? 'https://schema.org/NewCondition' : product.condition === 'seminovo' ? 'https://schema.org/UsedCondition' : undefined,
          seller: { '@type': 'Organization', name: clientConfig.company.legalName },
        },
      })}} />
    </div>
  );
}
