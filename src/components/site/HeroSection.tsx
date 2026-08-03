import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clientConfig } from '@/config/client';
import { useProductStore } from '@/lib/stores/productStore';
import { slugify } from '@/lib/utils/slugify';
import { safeImageUrl, priceLabel } from '@/lib/utils/productFallbacks';
import { DotGrid } from '@/components/effects/DotGrid';

export function HeroSection() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const active = products.filter(p => p.status === 'active');
  const product = active.find(p => p.featured) || active[0];

  const whatsappUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;
  const msg = product
    ? `Olá! Tenho interesse no ${product.title}. Pode me passar mais informações?`
    : clientConfig.company.contact.whatsappMessage;

  return (
    <section id="hero" className="relative overflow-hidden" style={{ background: '#07070a' }}>
      {/* Textura de fundo animada — reage a proximidade/velocidade do mouse */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={3.5}
          gap={24}
          baseColor="#232327"
          activeColor="#FAB70F"
          proximity={130}
          shockRadius={220}
          shockStrength={3}
          resistance={800}
          returnDuration={1.2}
          style={{ width: '100%', height: '100%', opacity: 0.7 }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-32 pb-16 md:pt-40 md:pb-20">
        <motion.span initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
          Até {clientConfig.features.maxInstallments}x sem juros
        </motion.span>

        <motion.h1 initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold tracking-tight leading-[1.08] mb-3"
          style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.1rem)', color: '#fff' }}>
          {product ? product.title : 'iPhone e Xiaomi originais'}
        </motion.h1>

        <motion.p initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.18 }}
          className="text-base md:text-lg mb-7" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {product ? 'Pronta entrega, com garantia e nota fiscal.' : 'Pronta entrega em Estância Velha, RS.'}
        </motion.p>

        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.24 }}
          className="flex items-center gap-6 mb-10">
          {product && (
            <Link to={`/produtos/${slugify(product.title)}`} className="hover-underline text-sm font-semibold" style={{ color: '#fff' }}>
              Ver detalhes
            </Link>
          )}
          <a href={`${whatsappUrl}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer"
            className="hover-underline text-sm font-semibold" style={{ color: 'hsl(43,96%,58%)' }}>
            Falar no WhatsApp
          </a>
        </motion.div>

        {product ? (
          <motion.div initial={{ y: 24, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl">
            {/* Halo suave e contínuo atrás do produto — CSS puro, leve */}
            <div className="absolute inset-0 rounded-[32px] animate-heroGlow" style={{ background: 'radial-gradient(ellipse at center, hsla(43,96%,60%,0.22) 0%, transparent 70%)', filter: 'blur(50px)' }} />
            <div className="relative rounded-[28px] overflow-hidden aspect-[4/3]" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <img src={safeImageUrl(product.image_url)} alt={product.title}
                className="w-full h-full object-cover animate-kenburns" />
            </div>
            <div className="mt-7 text-center">
              <span className="font-display text-2xl font-bold" style={{ color: '#fff' }}>{priceLabel(product.price)}</span>
              <span className="text-sm ml-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                ou {product.installments}x de {priceLabel(product.price / product.installments)}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-2xl aspect-[4/3] rounded-[28px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Carregando catálogo…</p>
          </div>
        )}
      </div>
    </section>
  );
}
