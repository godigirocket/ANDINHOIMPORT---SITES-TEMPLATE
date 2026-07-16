import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Testimonial {
  id: string; name: string; text: string; avatar_url: string | null; rating: number;
}

const DEFAULT: Testimonial[] = [
  {
    id: '1', name: 'Carlos Mendes', rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop&crop=faces',
    text: 'Comprei o iPhone 15 Pro Max e chegou em 2 dias úteis, lacrado e com nota. Atendimento via WhatsApp foi muito atencioso, tirou todas minhas dúvidas. Recomendo demais!',
  },
  {
    id: '2', name: 'Ana Paula Silva', rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&auto=format&fit=crop&crop=faces',
    text: 'Atendimento incrível! Consegui parcelar em 18x sem juros no cartão. Xiaomi 14 Ultra chegou perfeito, exatamente como descrito. Já indiquei pra família toda.',
  },
  {
    id: '3', name: 'Rafael Tavares', rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop&crop=faces',
    text: 'Já é a terceira vez que compro aqui. Sempre produtos originais, preço justo e entrega rápida. Confiança total. Não compro celular em outro lugar.',
  },
  {
    id: '4', name: 'Juliana Krause', rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&auto=format&fit=crop&crop=faces',
    text: 'Apple Watch Series 9 chegou lacrado com nota fiscal. Pulseira extra que pedi veio junto. Pagamento via Pix com 5% de desconto, super tranquilo. Recomendo!',
  },
  {
    id: '5', name: 'Pedro Henrique', rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80&auto=format&fit=crop&crop=faces',
    text: 'Melhor loja de importados da região Sul. Produto original, garantia real e suporte pós-venda excelente. Já fechei 2 vendas pra amigos depois da minha experiência.',
  },
  {
    id: '6', name: 'Fernanda Lima', rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop&crop=faces',
    text: 'Comprei o iPhone 14 seminovo e estava impecável, sem nenhum risco. Honestidade total na descrição. Veio com carregador original e película já aplicada. Voltarei a comprar!',
  },
];

const isSupabaseOk = () => {
  const u = import.meta.env.VITE_SUPABASE_URL as string;
  return !!u && u !== 'https://placeholder.supabase.co' && u.includes('supabase.co');
};

// Cores de avatar por índice
const avatarColors = [
  'linear-gradient(135deg,hsl(43,96%,52%),hsl(38,92%,44%))',
  'linear-gradient(135deg,hsl(200,100%,55%),hsl(220,90%,50%))',
  'linear-gradient(135deg,hsl(280,80%,65%),hsl(260,70%,55%))',
  'linear-gradient(135deg,hsl(142,71%,45%),hsl(160,80%,38%))',
  'linear-gradient(135deg,hsl(43,96%,52%),hsl(38,92%,44%))',
  'linear-gradient(135deg,hsl(200,100%,55%),hsl(220,90%,50%))',
];

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT);

  useEffect(() => {
    if (!isSupabaseOk()) return;
    supabase.from('testimonials').select('id,name,text,avatar_url,rating')
      .eq('active', true).order('created_at', { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setItems(data as Testimonial[]); });
  }, []);

  return (
    <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background — tom mais quente, diferente das outras seções */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, hsl(220,20%,4%) 0%, hsl(218,22%,5%) 40%, hsl(220,20%,4%) 100%)' }} />
      {/* Glow dourado superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsla(43,96%,52%,0.07) 0%, transparent 70%)' }} />
      {/* Glow inferior */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsla(200,100%,60%,0.04) 0%, transparent 70%)' }} />
      {/* Padrão de pontos */}
      <div className="absolute inset-0 pointer-events-none opacity-25"
        style={{ backgroundImage: 'radial-gradient(hsla(43,96%,52%,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} className="text-center mb-14">
          <h2 className="font-black text-4xl md:text-5xl tracking-tight mb-3">
            O que nossos <span className="gradient-text">clientes dizem</span>
          </h2>
          <p className="text-sm mb-5" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
            Mais de 2.500 clientes satisfeitos na região Sul
          </p>
          {/* Stars row */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ background: 'hsla(43,96%,52%,0.08)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
            {[...Array(5)].map((_,i) => (
              <Star key={i} className="w-4 h-4 text-primary fill-primary" />
            ))}
            <span className="text-sm font-black text-white ml-1">5.0</span>
            <span className="text-xs ml-1" style={{ color: 'hsla(45,20%,96%,0.4)' }}>· 2.5k+ avaliações</span>
          </div>
        </motion.div>

        {/* Grid de cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 6).map((t, i) => (
            <motion.div key={t.id}
              initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl p-6 transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, hsla(218,22%,8%,0.9) 0%, hsla(220,20%,6%,0.95) 100%)',
                border: '1px solid hsla(43,96%,52%,0.1)',
                boxShadow: '0 4px 20px hsla(0,0%,0%,0.3)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.border = '1px solid hsla(43,96%,52%,0.3)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px hsla(43,96%,52%,0.1), 0 0 0 1px hsla(43,96%,52%,0.12)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.border = '1px solid hsla(43,96%,52%,0.1)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px hsla(0,0%,0%,0.3)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}>

              {/* Quote icon decorativo */}
              <Quote className="w-7 h-7 mb-4 opacity-30 text-primary" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_,j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                ))}
              </div>

              {/* Texto */}
              <p className="text-sm leading-relaxed mb-6 line-clamp-4"
                style={{ color: 'hsla(45,20%,96%,0.65)' }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: avatarColors[i % avatarColors.length] }}>
                  {t.avatar_url
                    ? <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                    : <span className="text-sm font-black" style={{ color: 'hsl(220,20%,4%)' }}>{t.name.charAt(0)}</span>
                  }
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-[10px]" style={{ color: 'hsla(45,20%,96%,0.35)' }}>Cliente verificado ✓</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
