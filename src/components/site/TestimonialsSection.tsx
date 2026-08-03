import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote as QuoteIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { clientConfig } from '@/config/client';
import { ElectricBorder } from '@/components/effects/ElectricBorder';

interface Testimonial {
  id: string; name: string; text: string; avatar_url: string | null; rating: number;
}

const DEFAULT: Testimonial[] = [
  { id: '1', name: 'Carlos M.', rating: 5, avatar_url: null, text: 'iPhone 15 Pro Max chegou em 2 dias, lacrado e com nota. Atendimento impecável pelo WhatsApp.' },
  { id: '2', name: 'Ana Paula', rating: 5, avatar_url: null, text: 'Parcelei em 18x sem juros. Xiaomi 14 Ultra perfeito, exatamente como descrito.' },
  { id: '3', name: 'Rafael T.', rating: 5, avatar_url: null, text: 'Terceira compra aqui. Sempre original, preço justo e entrega rápida. Confiança total.' },
  { id: '4', name: 'Juliana K.', rating: 5, avatar_url: null, text: 'Apple Watch lacrado com nota fiscal. Pix com 5% de desconto, super tranquilo.' },
];

function ReviewCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px', amount: 0.2 }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <ElectricBorder color="#FAB70F" speed={0.6} chaos={0.15} borderRadius={16}>
        <div className="rounded-2xl p-6 flex flex-col" style={{ background: '#fff' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: 'hsl(43,96%,45%)' }} />
              ))}
            </div>
            <QuoteIcon className="w-5 h-5" style={{ color: '#eee' }} strokeWidth={2.5} />
          </div>
          <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: '#333' }}>
            "{t.text}"
          </p>
          <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #f2f2f2' }}>
            {t.avatar_url ? (
              <img src={t.avatar_url} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: '#f2f2f2', color: '#555' }}>
                {t.name.charAt(0)}
              </div>
            )}
            <p className="text-sm font-semibold" style={{ color: '#111' }}>{t.name}</p>
          </div>
        </div>
      </ElectricBorder>
    </motion.div>
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

  return (
    <section id="testimonials" className="relative py-14 md:py-20" style={{ background: '#fafafa' }}>
      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-6">
        <div className="mb-10">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: 'hsl(43,96%,42%)' }}>
            Depoimento verificado
          </p>
          <h2 className="font-display font-bold tracking-tight" style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)', color: '#111' }}>
            Quem já comprou, confirma
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((t, i) => <ReviewCard key={t.id} t={t} index={i} />)}
        </div>
      </div>
    </section>
  );
}
