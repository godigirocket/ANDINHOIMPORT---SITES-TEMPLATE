import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    if (!url || url.includes('placeholder')) return;
    supabase.from('testimonials').select('*').eq('active', true).then(({ data }) => {
      if (data && data.length > 0) setItems(data as Testimonial[]);
    });
  }, []);

  // Auto-scroll — 1 por vez
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const cardWidth = 320;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [items]);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: '#080808' }}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} className="mb-10">
          <h2 className="font-black text-2xl md:text-4xl tracking-tight">
            O que dizem <span className="gradient-text">nossos clientes</span>
          </h2>
        </motion.div>

        {/* Scroll container */}
        <div ref={scrollRef}
          className="flex gap-4 overflow-x-hidden snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((t) => (
            <div key={t.id}
              className="flex-shrink-0 w-full sm:w-[320px] snap-center p-6 rounded-2xl"
              style={{ background: '#0c0c0e', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-primary" />
                ))}
              </div>
              {/* Text */}
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#ccc' }}>
                "{t.text}"
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'hsla(43,96%,52%,0.15)', color: 'hsl(43,96%,52%)' }}>
                    {t.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-semibold text-white">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
