import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, CreditCard, Truck, ArrowRight } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useProductStore } from '@/lib/stores/productStore';
import { CharHoverText } from './CharHoverText';
import { PremiumButton } from '@/components/ui/PremiumButton';

gsap.registerPlugin(ScrollTrigger);

// Usadas só como último recurso, se ainda não houver 3 fotos reais de produto cadastradas
const STOCK_FALLBACK_IMAGES = [
  clientConfig.brand.heroBgImages[0],
  clientConfig.brand.heroBgImages[1],
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1600&q=85&auto=format&fit=crop',
];

const PANELS = [
  {
    icon: ShieldCheck,
    kicker: '01 · Autenticidade',
    title: 'Produtos 100% originais, sempre',
    text: 'Todo aparelho passa por checagem de autenticidade e testes rigorosos antes de chegar até você. Nada de réplica, nada de risco — só produto de procedência garantida.',
  },
  {
    icon: CreditCard,
    kicker: '02 · Pagamento',
    title: 'Parcele em até 18x sem juros',
    text: 'No cartão de crédito de qualquer banco, sem burocracia. Você escolhe o parcelamento que cabe no seu bolso e sai com o aparelho na mão.',
  },
  {
    icon: Truck,
    kicker: '03 · Entrega',
    title: 'Pronta entrega para toda região',
    text: 'A maioria dos modelos já está disponível pra envio imediato, com garantia e suporte pós-venda de verdade — sem robô, sem enrolação.',
  },
];

export function ProcessShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 992px)');
  const reducedMotion = useReducedMotion();
  const usePinned = isDesktop && !reducedMotion;
  const { products, fetchProducts } = useProductStore();

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Fotos reais de produtos em destaque primeiro — cai para imagens de banco só se faltar produto com foto
  const featured = products.filter(p => p.featured && p.image_url).map(p => p.image_url as string);
  const others = products.filter(p => !p.featured && p.image_url).map(p => p.image_url as string);
  const realPhotos = [...featured, ...others];
  const PANEL_IMAGES = [0, 1, 2].map((i) => realPhotos[i] || STOCK_FALLBACK_IMAGES[i]);

  useEffect(() => {
    if (!usePinned) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${window.innerHeight * (PANELS.length - 1)}`,
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(PANELS.length - 1, Math.floor(self.progress * PANELS.length));
        setActive(idx);
      },
    });

    return () => st.kill();
  }, [usePinned]);

  const whatsappUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`;

  if (usePinned) {
    return (
      <section ref={wrapperRef} className="relative" style={{ height: `${PANELS.length * 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center" style={{ background: 'hsl(240,6%,11%)' }}>
          {/* Imagens de fundo — crossfade + ken burns */}
          {PANEL_IMAGES.map((src, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{ opacity: i === active ? 1 : 0 }}>
              <div className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${src}')`,
                  transform: i === active ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 5s ease-out',
                }} />
            </div>
          ))}
          {/* Overlay reforçado — mesmo tratamento do Hero, garante contraste do texto sobre qualquer foto */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, hsla(240,6%,9%,0.98) 0%, hsla(240,6%,9%,0.88) 40%, hsla(240,6%,9%,0.45) 75%, hsla(240,6%,9%,0.3) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, hsla(240,6%,9%,0.5) 0%, transparent 35%)' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-lg">
              {/* Indicador de progresso */}
              <div className="flex gap-2 mb-8">
                {PANELS.map((_, i) => (
                  <div key={i} className="h-[3px] flex-1 rounded-full overflow-hidden" style={{ background: 'hsla(255,255%,255%,0.12)' }}>
                    <div className="h-full rounded-full transition-transform duration-500 origin-left"
                      style={{ background: 'hsl(43,96%,52%)', transform: `scaleX(${i <= active ? 1 : 0})` }} />
                  </div>
                ))}
              </div>

              <div className="relative min-h-[260px] md:min-h-[240px]">
              <AnimatePresence>
                <motion.div key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: 'hsla(43,96%,52%,0.12)', border: '1px solid hsla(43,96%,52%,0.3)' }}>
                    {(() => { const Icon = PANELS[active].icon; return <Icon className="w-5 h-5" style={{ color: 'hsl(43,96%,52%)' }} />; })()}
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'hsl(43,96%,52%)' }}>
                    {PANELS[active].kicker}
                  </p>
                  <h2 className="font-black text-3xl md:text-4xl tracking-tight text-white mb-4 leading-[1.05]">
                    <CharHoverText text={PANELS[active].title} />
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsla(45,20%,96%,0.65)' }}>
                    {PANELS[active].text}
                  </p>
                </motion.div>
              </AnimatePresence>
              </div>

              <div className="mt-6">
                <PremiumButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="primary" className="text-sm">
                  Falar no WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </PremiumButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mobile / reduced-motion: cards empilhados normais, sem pin
  return (
    <section className="relative py-20" style={{ background: 'hsl(240,6%,11%)' }}>
      <div className="max-w-xl mx-auto px-4 space-y-4">
        {PANELS.map((panel, i) => (
          <motion.div key={panel.title}
            initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-2xl overflow-hidden relative"
            style={{ border: '1px solid hsla(43,96%,52%,0.1)' }}>
            <div className="aspect-[16/10] bg-cover bg-center relative"
              style={{ backgroundImage: `url('${PANEL_IMAGES[i]}')` }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, hsla(240,6%,11%,0.95) 100%)' }} />
              <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'hsla(43,96%,52%,0.15)', border: '1px solid hsla(43,96%,52%,0.35)' }}>
                <panel.icon className="w-4.5 h-4.5" style={{ color: 'hsl(43,96%,52%)' }} />
              </div>
            </div>
            <div className="p-5" style={{ background: 'hsl(240,6%,15%)' }}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'hsl(43,96%,52%)' }}>{panel.kicker}</p>
              <h3 className="font-black text-lg text-white mb-2">{panel.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'hsla(45,20%,96%,0.6)' }}>{panel.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
