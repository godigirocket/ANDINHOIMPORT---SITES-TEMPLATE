import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Wrench, Truck, Star, Clock, LucideIcon } from 'lucide-react';
import { clientConfig } from '@/config/client';

const iconMap: Record<string, LucideIcon> = { ShieldCheck, CreditCard, Wrench, Truck, Star, Clock };

// Cores únicas por card
const cardAccents = [
  { border: 'hsla(43,96%,52%,0.25)',  glow: 'hsla(43,96%,52%,0.08)',  icon: 'hsla(43,96%,52%,1)'  },
  { border: 'hsla(200,100%,60%,0.2)', glow: 'hsla(200,100%,60%,0.06)', icon: 'hsla(200,100%,60%,1)' },
  { border: 'hsla(280,80%,65%,0.2)',  glow: 'hsla(280,80%,65%,0.06)',  icon: 'hsla(280,80%,65%,1)'  },
  { border: 'hsla(142,71%,45%,0.2)',  glow: 'hsla(142,71%,45%,0.06)',  icon: 'hsla(142,71%,45%,1)'  },
  { border: 'hsla(43,96%,52%,0.25)',  glow: 'hsla(43,96%,52%,0.08)',  icon: 'hsla(43,96%,52%,1)'  },
  { border: 'hsla(200,100%,60%,0.2)', glow: 'hsla(200,100%,60%,0.06)', icon: 'hsla(200,100%,60%,1)' },
];

export function FeaturesSection() {
  const { features } = clientConfig.initialContent;
  const waUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`;

  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background diferente — mais escuro com tom azul-marinho */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(220,20%,4%) 0%, hsl(222,28%,5%) 50%, hsl(220,20%,4%) 100%)' }} />
      {/* Glow central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsla(43,96%,52%,0.04) 0%, transparent 70%)' }} />
      {/* Linhas verticais decorativas */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 120px, hsla(43,96%,52%,0.03) 120px, hsla(43,96%,52%,0.03) 121px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} className="mb-14">
          <h2 className="font-black text-4xl md:text-5xl tracking-tight mb-3">
            Por que escolher a{' '}
            <span className="gradient-text">{clientConfig.company.name} {clientConfig.company.nameHighlight}?</span>
          </h2>
          <p className="text-sm max-w-md" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
            Trabalhamos com transparência e qualidade para garantir sua satisfação
          </p>
        </motion.div>

        {/* Grid 3x2 com cards coloridos */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon] || ShieldCheck;
            const accent = cardAccents[i % cardAccents.length];
            return (
              <motion.div key={feature.id}
                initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl p-6 transition-all duration-300"
                style={{
                  background: `linear-gradient(145deg, hsla(222,28%,8%,0.9) 0%, hsla(220,20%,6%,0.95) 100%)`,
                  border: `1px solid ${accent.border}`,
                  boxShadow: `0 4px 20px hsla(0,0%,0%,0.3)`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${accent.glow}, 0 0 0 1px ${accent.border}`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px hsla(0,0%,0%,0.3)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}>
                {/* Glow de fundo no hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 30% 30%, ${accent.glow}, transparent 70%)` }} />

                <div className="relative z-10 flex gap-4">
                  {/* Ícone com cor única */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{ background: `${accent.glow}`, border: `1px solid ${accent.border}` }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${accent.icon}40`)}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}>
                    <Icon className="w-5 h-5" style={{ color: accent.icon }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1.5 text-white group-hover:transition-colors"
                      style={{ transition: 'color 0.2s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = accent.icon)}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'white')}>
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'hsla(45,20%,96%,0.5)' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA inline premium */}
        <motion.div initial={{ y: 16, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, hsla(43,96%,52%,0.08) 0%, hsla(43,96%,52%,0.04) 100%)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
          <div>
            <p className="font-bold text-base text-white">Ficou com dúvidas?</p>
            <p className="text-sm" style={{ color: 'hsla(45,20%,96%,0.5)' }}>Fale diretamente com a gente no WhatsApp</p>
          </div>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="btn-gold flex items-center gap-2 text-sm flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Fale Conosco
          </a>
        </motion.div>
      </div>
    </section>
  );
}
