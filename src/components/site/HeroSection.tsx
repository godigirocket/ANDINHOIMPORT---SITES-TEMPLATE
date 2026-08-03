import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, MessageCircle, ShieldCheck, Truck, BadgeCheck } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useProductStore } from '@/lib/stores/productStore';
import { safeImageUrl } from '@/lib/utils/productFallbacks';

export function HeroSection() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const active = products.filter(p => p.status === 'active');
  const product = active.find(p => p.featured) || active[0];
  const heroImage = safeImageUrl(product?.image_url);
  const whatsappUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;
  const msg = product
    ? `Ola! Tenho interesse no ${product.title}. Pode me passar mais informacoes?`
    : clientConfig.company.contact.whatsappMessage;

  const badges = [
    { icon: ShieldCheck, label: 'Produtos originais', sub: 'garantido' },
    { icon: Truck, label: 'Pronta entrega', sub: 'garantido' },
    { icon: BadgeCheck, label: 'Garantia total', sub: 'garantido' },
  ];

  return (
    <section id="hero" className="section-blur-end relative min-h-screen overflow-hidden bg-[#090a0f]">
      <motion.img
        src={heroImage}
        alt=""
        aria-hidden="true"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.52 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover object-[68%_50%]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(6,8,14,0.96) 0%, rgba(8,10,18,0.74) 38%, rgba(10,12,20,0.44) 70%, rgba(8,8,12,0.74) 100%)',
        }}
      />
      <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 18% 62%, rgba(250,183,15,0.16), transparent 34%)' }} />

      <div className="relative z-10 flex min-h-screen items-center px-5 pb-20 pt-28 sm:px-8 lg:px-12">
        <div className="w-full max-w-[1220px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="mb-6 text-[11px] font-black uppercase tracking-[0.32em] text-primary sm:text-xs">
              Novos modelos disponiveis
            </p>
            <h1 className="font-display text-[clamp(4rem,11vw,8.8rem)] font-black uppercase leading-[0.78] tracking-tight">
              <span className="block text-[#f2eee2] drop-shadow-[0_10px_30px_rgba(0,0,0,0.38)]">Andinho</span>
              <span className="block text-primary drop-shadow-[0_14px_34px_rgba(250,183,15,0.2)]">Import</span>
            </h1>
            <p className="mt-8 max-w-xl border-l-2 border-primary pl-5 text-base font-medium leading-relaxed text-white/78 sm:text-xl">
              Apple, Xiaomi e Smartwatches com garantia, parcelamento em ate 18x e entrega rapida para toda regiao Sul
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.58 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {badges.map(item => (
                <div
                  key={item.label}
                  className="animated-container flex items-center gap-2 rounded-full px-4 py-2 text-left"
                  style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(14px)' }}
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-black uppercase leading-none tracking-wide text-white">
                    {item.label}
                    <span className="block pt-1 text-[9px] text-white/54">{item.sub}</span>
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.58 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a
                href={`${whatsappUrl}?text=${encodeURIComponent(msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="animated-container inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-black text-black shadow-[0_18px_42px_rgba(250,183,15,0.24)] transition-transform hover:-translate-y-1"
                style={{ background: '#FAB70F', color: '#050505' }}
              >
                <MessageCircle className="h-5 w-5" />
                Garanta Agora
              </a>
              <Link
                to="/produtos"
                className="animated-container inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-black text-white transition-transform hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(14px)' }}
              >
                Explorar Catalogo
                <ChevronDown className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#products"
        aria-label="Rolar para produtos"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 rounded-full p-3 text-white/70 md:block"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </motion.a>
    </section>
  );
}
