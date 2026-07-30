import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Shield, Truck, CreditCard, Check } from 'lucide-react';
import { getProductBySlug, getWhatsAppUrl } from '@/data/products';
import { clientConfig } from '@/config/client';
import { RevealText } from '@/components/ui/RevealText';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { TiltCard } from '@/components/ui/TiltCard';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? getProductBySlug(slug) : undefined;

  useEffect(() => {
    if (product) {
      document.title = `${product.title} ${product.storage} | ${clientConfig.company.name}`;
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[hsl(240,6%,11%)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Produto não encontrado</p>
          <PremiumButton onClick={() => navigate('/')} variant="primary" className="px-6 py-3 text-sm">
            Voltar ao início
          </PremiumButton>
        </div>
      </div>
    );
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  return (
    <div className="min-h-screen bg-[hsl(240,6%,11%)] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-4 py-4" style={{ background: 'hsla(240,6%,9%,0.85)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="hover-underline flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <PremiumButton
            href={getWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="px-4 py-2 text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Consultar
          </PremiumButton>
        </div>
      </header>

      <main className="pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-28"
          >
            <TiltCard intensity={5} className="rounded-3xl" style={{ background: 'hsl(240,6%,16%)' }}>
              <img
                src={product.image}
                alt={`${product.title} ${product.storage} ${product.color}`}
                className="product-reflect w-full aspect-square object-contain p-10"
              />
            </TiltCard>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {product.badge && (
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase" style={{ background: 'rgba(245,183,0,0.12)', color: '#F5B700', border: '1px solid rgba(245,183,0,0.3)' }}>
                {product.badge}
              </span>
            )}

            <RevealText as="h1" className="text-3xl md:text-4xl font-black">
              {product.title} <span style={{ color: '#F5B700' }}>{product.storage}</span>
            </RevealText>

            <p className="text-sm" style={{ color: '#a6a6aa' }}>
              {product.color} · {product.condition}
            </p>

            <p className="text-sm leading-relaxed" style={{ color: '#888' }}>
              {product.description}
            </p>

            {/* Price */}
            <div className="p-5 rounded-2xl" style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black" style={{ color: '#F5B700' }}>{fmt(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-sm line-through" style={{ color: '#666' }}>{fmt(product.oldPrice)}</span>
                )}
              </div>
              <p className="text-sm mt-1" style={{ color: '#888' }}>
                ou {product.installments}x de {fmt(product.installmentValue)} sem juros
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: `Garantia ${product.warranty}` },
                { icon: Truck, label: product.availability },
                { icon: CreditCard, label: `Até ${product.installments}x sem juros` },
                { icon: Check, label: 'Produto original' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'hsl(240,6%,16%)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#F5B700' }} />
                  <span className="text-xs" style={{ color: '#ccc' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <PremiumButton
              href={getWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="w-full py-4 text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Consultar no WhatsApp
            </PremiumButton>

            <p className="text-center text-xs" style={{ color: '#666' }}>
              Tire dúvidas e feche negócio direto com nossa equipe
            </p>
          </motion.div>
        </div>
      </main>

      {/* JSON-LD Product */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${product.title} ${product.storage}`,
        description: product.description,
        image: product.image,
        brand: { '@type': 'Brand', name: product.category === 'apple' ? 'Apple' : 'Xiaomi' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: product.price,
          availability: 'https://schema.org/InStock',
          itemCondition: product.condition === 'Novo lacrado' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
          seller: { '@type': 'Organization', name: clientConfig.company.legalName },
        },
      })}} />
    </div>
  );
}
