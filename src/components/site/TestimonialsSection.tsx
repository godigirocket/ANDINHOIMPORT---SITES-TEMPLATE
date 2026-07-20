import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    if (!url || url.includes('placeholder')) return;
    supabase.from('testimonials').select('*').eq('active', true).then(({ data }) => {
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
    <section className="relative py-16 md:py-24" style={{ background: '#080808' }}>
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} className="mb-8">
          <h2 className="font-black text-2xl md:text-3xl tracking-tight text-center">
            O que dizem <span className="gradient-text">nossos clientes</span>
          </h2>
        </motion.div>

        {/* 1 depoimento por vez com fade */}
        <div className="relative min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center w-full"
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
        </div>

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
