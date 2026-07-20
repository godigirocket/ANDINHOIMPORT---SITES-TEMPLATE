import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronDown, ShieldCheck, Zap, Award } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1696446702183-be9605d12d09?w=1600&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1696446702183-be9605d12d09?w=1600&q=85&auto=format&fit=crop',
];

const iconMap: Record<string, React.ElementType> = { ShieldCheck, Zap, Award };

export function HeroSection() {
  const { content } = useContentStore();
  const { hero } = clientConfig.initialContent;
  const [bgIdx, setBgIdx] = useState(0);

  const bgImages = [
    content.hero_bg_1 || FALLBACK_IMAGES[0],
    content.hero_bg_2 || FALLBACK_IMAGES[1],
  ];

  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % bgImages.length), 7000);
    return () => clearInterval(t);
  }, [bgImages.length]);

  const whatsappUrl = content.whatsapp_link || `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;
  const msg = encodeURIComponent(clientConfig.company.contact.whatsappMessage);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background images com crossfade */}
      {bgImages.map((src, i) => (
        <motion.div key={i}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${src}')` }}
          animate={{ opacity: i === bgIdx ? 1 : 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(105deg, hsla(220,20%,4%,0.95) 0%, hsla(220,20%,4%,0.75) 50%, hsla(220,20%,4%,0.2) 100%)' }} />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, hsl(220,20%,4%) 0%, transparent 30%)' }} />

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-28 pb-24">
        <div className="max-w-xl">
          <motion.p initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-wide uppercase mb-6 text-primary">
            {content.hero_badge || hero.badge}
          </motion.p>

          <motion.h1 initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-black leading-[0.88] tracking-tight mb-6"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
            <span className="text-white block">{content.hero_title || hero.headline}</span>
            <span className="gradient-text block">{hero.headlineGold}</span>
          </motion.h1>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="text-sm md:text-base max-w-md mb-8 leading-relaxed"
            style={{ color: 'hsla(45,20%,96%,0.65)', borderLeft: '2px solid hsla(43,96%,52%,0.6)', paddingLeft: '14px' }}>
            {content.hero_subtitle || hero.subheadline}
          </motion.p>

          {/* Badges */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.26 }}
            className="flex flex-wrap gap-2.5 mb-10">
            {hero.badges.map((b) => {
              const Icon = iconMap[b.icon] || ShieldCheck;
              return (
                <div key={b.label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'hsla(220,20%,8%,0.85)', border: '1px solid hsla(43,96%,52%,0.22)' }}>
                  <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black text-white leading-none tracking-wide">{b.label}</p>
                    <p className="text-[8px] text-primary leading-none mt-0.5 font-semibold">{b.sub}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.34 }}
            className="flex flex-wrap gap-3">
            <a href={`${whatsappUrl}?text=${msg}`} target="_blank" rel="noopener noreferrer"
              className="btn-gold flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4" />
              {content.cta_primary_text || hero.ctaPrimary}
            </a>
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
              style={{ border: '1px solid hsla(255,255%,255%,0.18)', color: 'hsla(45,20%,96%,0.75)', background: 'hsla(220,20%,8%,0.4)' }}>
              {content.cta_secondary_text || hero.ctaSecondary}
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
          style={{ color: 'hsla(45,20%,96%,0.3)' }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
