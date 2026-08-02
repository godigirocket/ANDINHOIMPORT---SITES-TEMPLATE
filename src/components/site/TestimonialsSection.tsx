import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote as QuoteIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';
import { RevealText } from '@/components/ui/RevealText';

interface Testimonial {
  id: string; name: string; text: string; avatar_url: string | null; rating: number;
}

const DEFAULT: Testimonial[] = [
  { id: '1', name: 'Carlos M.', rating: 5, avatar_url: null, text: 'iPhone 15 Pro Max chegou em 2 dias, lacrado e com nota. Atendimento impecável pelo WhatsApp.' },
  { id: '2', name: 'Ana Paula', rating: 5, avatar_url: null, text: 'Parcelei em 18x sem juros. Xiaomi 14 Ultra perfeito, exatamente como descrito.' },
  { id: '3', name: 'Rafael T.', rating: 5, avatar_url: null, text: 'Terceira compra aqui. Sempre original, preço justo e entrega rápida. Confiança total.' },
  { id: '4', name: 'Juliana K.', rating: 5, avatar_url: null, text: 'Apple Watch lacrado com nota fiscal. Pix com 5% de desconto, super tranquilo.' },
];

function Quote({ t }: { t: Testimonial }) {
  return (
    <motion.div
      key={t.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0"
    >
      <QuoteIcon className="mb-4 w-8 h-8" style={{ color: 'hsla(43,96%,52%,0.4)' }} strokeWidth={2.5} />
      <p className="font-display font-bold leading-[1.2] mb-8 text-white" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.9rem)' }}>
        {t.text}
      </p>
      <div className="flex items-center gap-4">
        {t.avatar_url ? (
          <img src={t.avatar_url} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
        ) : (
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: 'hsla(43,96%,52%,0.15)', color: 'hsl(43,96%,52%)' }}>
            {t.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-white">{t.name}</p>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" style={{ color: 'hsl(43,96%,52%)' }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

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

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => setCurrent(prev => (prev + 1) % items.length), 5500);
    return () => clearInterval(interval);
  }, [items.length]);

  const t = items[current];
  if (!t) return null;

  return (
    <section id="testimonials" className="relative py-14 md:py-20 overflow-hidden" style={{ background: 'hsl(240,6%,10%)' }}>
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <div className="mb-10 md:mb-14">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'hsl(43,96%,52%)' }}>
            Depoimento verificado
          </p>
          <RevealText as="h2" className="font-display font-bold tracking-tight text-white">
            <span style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)' }}>Quem já comprou, confirma</span>
          </RevealText>
        </div>

        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <Quote key={t.id} t={t} />
          </AnimatePresence>
        </div>

        <div className="flex gap-1.5 mt-10">
          {items.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Depoimento ${i + 1}`}
              className="h-[3px] rounded-full transition-all"
              style={{ width: i === current ? '28px' : '14px', background: i === current ? 'hsl(43,96%,52%)' : 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
