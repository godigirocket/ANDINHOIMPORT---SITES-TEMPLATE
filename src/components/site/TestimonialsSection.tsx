import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote as QuoteIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';

interface Testimonial {
  id: string; name: string; text: string; avatar_url: string | null; rating: number;
}

const DEFAULT: Testimonial[] = [
  { id: '1', name: 'Carlos M.', rating: 5, avatar_url: null, text: 'iPhone 15 Pro Max chegou em 2 dias, lacrado e com nota. Atendimento impecavel pelo WhatsApp.' },
  { id: '2', name: 'Ana Paula', rating: 5, avatar_url: null, text: 'Parcelei em 18x sem juros. Xiaomi 14 Ultra perfeito, exatamente como descrito.' },
  { id: '3', name: 'Rafael T.', rating: 5, avatar_url: null, text: 'Terceira compra aqui. Sempre original, preco justo e entrega rapida. Confianca total.' },
  { id: '4', name: 'Juliana K.', rating: 5, avatar_url: null, text: 'Apple Watch lacrado com nota fiscal. Pix com 5% de desconto, super tranquilo.' },
];

function ReviewCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px', amount: 0.2 }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-w-[290px] max-w-[290px] sm:min-w-[340px] sm:max-w-[340px] rounded-xl p-5 sm:p-6 bg-white overflow-hidden"
      style={{ border: '1px solid rgba(17,17,17,0.07)', boxShadow: '0 16px 38px rgba(0,0,0,0.08)' }}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: 'linear-gradient(90deg, #FAB70F, #f2d36b)' }} />
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-0.5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: 'hsl(43,96%,45%)' }} />
          ))}
        </div>
        <QuoteIcon className="w-5 h-5" style={{ color: '#e9e9e9' }} strokeWidth={2.5} />
      </div>
      <p className="text-sm leading-relaxed mb-5 min-h-[84px]" style={{ color: '#303030' }}>
        &quot;{t.text}&quot;
      </p>
      <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
        {t.avatar_url ? (
          <img src={t.avatar_url} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{ background: '#f3f3f3', color: '#555' }}>
            {t.name.charAt(0)}
          </div>
        )}
        <p className="text-sm font-bold truncate" style={{ color: '#111' }}>{t.name}</p>
      </div>
    </motion.article>
  );
}

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    if (!url || url.includes('placeholder')) return;
    supabase.from('testimonials').select('*').eq('client_id', clientConfig.id).eq('active', true).then(({ data }) => {
      if (data && data.length > 0) setItems(data as Testimonial[]);
    });
  }, []);

  if (items.length === 0) return null;
  const carouselItems = [...items, ...items];

  return (
    <section id="testimonials" className="relative py-14 md:py-20 overflow-hidden" style={{ background: '#fafafa' }}>
      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="mb-9">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'hsl(43,96%,42%)' }}>
            Depoimento verificado
          </p>
          <h2 className="font-display font-black tracking-tight" style={{ fontSize: 'clamp(1.45rem, 2.2vw, 2rem)', color: '#111' }}>
            Quem ja comprou, confirma
          </h2>
        </div>

        <div className="relative -mx-4 overflow-hidden px-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#fafafa] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#fafafa] to-transparent" />
          <motion.div
            className="flex w-max gap-4 md:gap-5"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: Math.max(18, items.length * 5), ease: 'linear', repeat: Infinity }}
          >
            {carouselItems.map((t, i) => <ReviewCard key={`${t.id}-${i}`} t={t} index={i} />)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
