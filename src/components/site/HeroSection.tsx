import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronDown, ShieldCheck, Zap, Award } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';

// Imagens de fundo — vêm do contentStore (editáveis pelo painel admin)
// Fallback: Unsplash em alta qualidade (sem bloqueio de hotlinking)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=95&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=95&auto=format&fit=crop',
];

const iconMap: Record<string, React.ElementType> = { ShieldCheck, Zap, Award };

export function HeroSection() {
  const { content } = useContentStore();
  const { hero } = clientConfig.initialContent;
  const [bgIdx, setBgIdx] = useState(0);

  // URLs das imagens vêm do painel admin (contentStore)
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

      {/* Overlay cinematográfico — escuro à esquerda, transparente à direita */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(105deg, hsla(220,20%,4%,0.97) 0%, hsla(220,20%,4%,0.82) 45%, hsla(220,20%,4%,0.25) 100%)' }} />
      {/* Fade inferior */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, hsl(220,20%,4%) 0%, transparent 35%)' }} />
      {/* Glow dourado ambiente */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 15% 65%, hsla(43,96%,52%,0.1) 0%, transparent 70%)' }} />
      {/* Grid futurista sutil */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(hsla(43,96%,52%,0.05) 1px, transparent 1px), linear-gradient(90deg, hsla(43,96%,52%,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.4,
        }} />

      {/* Indicadores de slide */}
      <div className="absolute bottom-20 right-8 z-20 flex flex-col gap-2">
        {bgImages.map((_, i) => (
          <button key={i} onClick={() => setBgIdx(i)}
            className="w-1.5 rounded-full transition-all duration-300"
            style={{
              height: i === bgIdx ? '24px' : '6px',
              background: i === bgIdx ? 'hsl(43,96%,52%)' : 'hsla(255,255%,255%,0.25)',
              boxShadow: i === bgIdx ? '0 0 8px hsla(43,96%,52%,0.6)' : 'none',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-28 pb-24">
        <div className="max-w-xl">

          {/* Badge pill */}
          <motion.div initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ border: '1px solid hsla(43,96%,52%,0.4)', background: 'hsla(43,96%,52%,0.08)', backdropFilter: 'blur(8px)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-primary">
              {content.hero_badge || hero.badge}
            </span>
          </motion.div>

          {/* Título gigante */}
          <motion.h1 initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-black leading-[0.88] tracking-tight mb-6"
            style={{ fontSize: 'clamp(3.8rem, 11vw, 8rem)' }}>
            <span className="text-white block drop-shadow-2xl">{content.hero_title || hero.headline}</span>
            <span className="gradient-text block drop-shadow-2xl">{hero.headlineGold}</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="text-sm md:text-base max-w-md mb-8 leading-relaxed"
            style={{
              color: 'hsla(45,20%,96%,0.65)',
              borderLeft: '2px solid hsla(43,96%,52%,0.6)',
              paddingLeft: '14px',
            }}>
            {content.hero_subtitle || hero.subheadline}
          </motion.p>

          {/* Mini badges de diferenciais */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.26 }}
            className="flex flex-wrap gap-2.5 mb-10">
            {hero.badges.map((b) => {
              const Icon = iconMap[b.icon] || ShieldCheck;
              return (
                <div key={b.label} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{
                    background: 'hsla(220,20%,8%,0.85)',
                    border: '1px solid hsla(43,96%,52%,0.22)',
                    backdropFilter: 'blur(10px)',
                  }}>
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
              style={{
                border: '1px solid hsla(255,255%,255%,0.18)',
                color: 'hsla(45,20%,96%,0.75)',
                backdropFilter: 'blur(10px)',
                background: 'hsla(220,20%,8%,0.4)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'hsla(43,96%,52%,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'hsla(45,20%,96%,0.75)'; (e.currentTarget as HTMLElement).style.borderColor = 'hsla(255,255%,255%,0.18)'; }}>
              {content.cta_secondary_text || hero.ctaSecondary}
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.44 }}
            className="flex gap-8 mt-12 pt-8"
            style={{ borderTop: '1px solid hsla(255,255%,255%,0.08)' }}>
            {[
              { value: '18x', label: 'sem juros' },
              { value: '2.5k+', label: 'clientes' },
              { value: '100%', label: 'original' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-primary leading-none">{stat.value}</p>
                <p className="text-[10px] mt-1" style={{ color: 'hsla(45,20%,96%,0.4)' }}>{stat.label}</p>
              </div>
            ))}
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
