import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';
import { RevealText } from '@/components/ui/RevealText';
import { TiltCard } from '@/components/ui/TiltCard';

interface Testimonial {
  id: string; name: string; text: string; avatar_url: string | null; rating: number;
}

const DEFAULT: Testimonial[] = [
  { id: '1', name: 'Carlos M.', rating: 5, avatar_url: null, text: 'iPhone 15 Pro Max chegou em 2 dias, lacrado e com nota. Atendimento impecável pelo WhatsApp.' },
  { id: '2', name: 'Ana Paula', rating: 5, avatar_url: null, text: 'Parcelei em 18x sem juros. Xiaomi 14 Ultra perfeito, exatamente como descrito.' },
  { id: '3', name: 'Rafael T.', rating: 5, avatar_url: null, text: 'Terceira compra aqui. Sempre original, preço justo e entrega rápida. Confiança total.' },
  { id: '4', name: 'Juliana K.', rating: 5, avatar_url: null, text: 'Apple Watch lacrado com nota fiscal. Pix com 5% de desconto, super tranquilo.' },
];

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    if (!url || url.includes('placeholder')) return;
    supabase.from('testimonials').select('*').eq('client_id', clientConfig.id).eq('active', true).then(({ data }) => {
      if (data && data.length > 0) setItems(data as Testimonial[]);
    });
  }, []);

  // Auto-rotate: 1 por vez com fade
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  const t = items[current];
  if (!t) return null;

  return (
    <section id="testimonials" className="relative py-16 md:py-24" style={{ background: 'hsl(28,18%,14%)' }}>
      <div className="relative max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <RevealText as="h2" className="font-black text-2xl md:text-3xl tracking-tight">
            O que dizem <span className="gradient-text">nossos clientes</span>
          </RevealText>
        </div>

        {/* Card de depoimento com profundidade (tilt 3D) — crossfade sobreposto por dentro */}
        <TiltCard intensity={4} className="relative min-h-[220px] p-8"
          style={{ background: 'hsla(28,14%,20%,0.6)', border: '1px solid hsla(43,96%,52%,0.12)', backdropFilter: 'blur(12px)' }}>
          <AnimatePresence>
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center w-full px-8"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: 'hsl(43,96%,52%)' }} />
                ))}
              </div>

              {/* Text */}
              <p className="text-base md:text-lg leading-relaxed mb-5 italic" style={{ color: '#ddd' }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-3">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'hsla(43,96%,52%,0.15)', color: 'hsl(43,96%,52%)' }}>
                    {t.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-semibold text-white">{t.name}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </TiltCard>

        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-6">
          {items.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ background: i === current ? 'hsl(43,96%,52%)' : 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
