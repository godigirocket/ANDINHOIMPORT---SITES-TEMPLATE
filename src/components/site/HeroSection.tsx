import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronDown, Shield, CreditCard, Package, Truck } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useContentStore } from '@/lib/stores/contentStore';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { WebGLFallback } from '@/components/three/WebGLFallback';

// Lazy load do canvas 3D — Three.js não carrega até ser necessário
const AndinhoHeroCanvas = lazy(() =>
  import('@/components/three/AndinhoHeroCanvas').then(m => ({ default: m.AndinhoHeroCanvas }))
);

export function HeroSection() {
  const { content } = useContentStore();
  const webglSupported = useWebGLSupport();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const whatsappUrl = content.whatsapp_link || `https://wa.me/${clientConfig.company.contact.whatsappNumber}`;
  const msg = encodeURIComponent(clientConfig.company.contact.whatsappMessage);

  // Track scroll progress para o canvas 3D
  useEffect(() => {
    if (reducedMotion) return;
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  const show3D = webglSupported && !reducedMotion;

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: '#050505' }} />
      {/* Glow ambiental dourado sutil */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(245,183,0,0.06) 0%, transparent 70%)' }} />

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-24 md:py-0">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen">
          
          {/* Lado esquerdo — Texto */}
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: '#F5B700' }}
            >
              Tecnologia, procedência e confiança
            </motion.p>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-black tracking-tight mb-5 leading-[0.9]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              <span className="text-white block">Seu próximo</span>
              <span style={{ color: '#F5B700' }} className="block">smartphone</span>
              <span className="text-white block">está aqui.</span>
            </motion.h1>

            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base max-w-md mb-8 leading-relaxed"
              style={{ color: '#a6a6aa' }}
            >
              Apple, Xiaomi, smartwatches e acessórios com garantia, 
              parcelamento e atendimento direto em {clientConfig.company.location.city}.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 rounded-full text-sm font-bold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #F5B700, #d4a000)',
                  color: '#050505',
                  boxShadow: '0 8px 24px rgba(245,183,0,0.25)',
                }}
              >
                Ver Produtos
              </button>
              <a
                href={`${whatsappUrl}?text=${msg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#f7f7f7' }}
              >
                <MessageCircle className="w-4 h-4" />
                Chamar no WhatsApp
              </a>
            </motion.div>

            {/* Selos */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: CreditCard, label: 'Até 18x' },
                { icon: Shield, label: 'Garantia' },
                { icon: Package, label: 'Original' },
                { icon: Truck, label: 'Pronta entrega' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" style={{ color: '#F5B700' }} />
                  <span className="text-[11px] font-medium" style={{ color: '#888' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Lado direito — Canvas 3D ou Fallback */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 h-[350px] md:h-[500px] lg:h-[600px] relative"
          >
            {show3D ? (
              <Suspense fallback={<WebGLFallback />}>
                <AndinhoHeroCanvas scrollProgress={scrollProgress} />
              </Suspense>
            ) : (
              <WebGLFallback />
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
