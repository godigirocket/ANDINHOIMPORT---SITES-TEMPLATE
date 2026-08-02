import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { RevealText } from '@/components/ui/RevealText';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useParallax } from '@/hooks/useParallax';

// Frame 6 — Confiança: números reais da operação, banda editorial em vez de
// seis ícones em card. Cada número é uma afirmação verificável, não um adjetivo.
const stats = [
  { icon: CreditCard,  value: `${clientConfig.features.maxInstallments}x`,  label: 'sem juros no cartão, qualquer banco' },
  { icon: ShieldCheck, value: '100%', label: 'dos aparelhos testados antes de anunciar' },
  { icon: Truck,       value: '2', label: 'dias úteis em média até o envio sair' },
  { icon: Headphones,  value: '0', label: 'robôs — quem responde conhece o estoque' },
];

export function FeaturesSection() {
  const waUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`;
  const glowRef = useParallax<HTMLDivElement>(0.25);

  return (
    <section id="features" className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(240,6%,11%) 0%, hsl(224,30%,16%) 50%, hsl(240,6%,11%) 100%)' }} />
      <div ref={glowRef} className="absolute top-1/2 left-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ marginLeft: '-400px', marginTop: '-200px', background: 'radial-gradient(ellipse, hsla(43,96%,52%,0.05) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-6">
        <div className="mb-14 max-w-lg">
          <RevealText as="h2" className="font-display font-black tracking-tight mb-3 text-white"
            >
            <span style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.1rem)' }}>
              Números que você pode conferir, não promessas
            </span>
          </RevealText>
          <motion.p initial={{ y: 12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="text-sm" style={{ color: 'hsla(45,20%,96%,0.5)' }}>
            Cada número aqui é verificável direto com quem já comprou — sem estatística inflada.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border-t pt-5" style={{ borderColor: 'hsla(43,96%,52%,0.2)' }}>
              <s.icon className="w-4 h-4 mb-4" style={{ color: 'hsl(43,96%,52%)' }} />
              <p className="font-display font-black leading-none mb-2 text-white" style={{ fontSize: 'clamp(2rem, 2.8vw, 2.6rem)' }}>
                {s.value}
              </p>
              <p className="text-xs leading-relaxed max-w-[16ch]" style={{ color: 'hsla(45,20%,96%,0.55)' }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ y: 16, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, hsla(43,96%,52%,0.08) 0%, hsla(43,96%,52%,0.04) 100%)', border: '1px solid hsla(43,96%,52%,0.2)' }}>
          <div>
            <p className="font-bold text-base text-white">Ficou com dúvidas?</p>
            <p className="text-sm" style={{ color: 'hsla(45,20%,96%,0.5)' }}>Fale diretamente com a gente no WhatsApp</p>
          </div>
          <PremiumButton href={waUrl} target="_blank" rel="noopener noreferrer"
            variant="primary" className="text-sm flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Fale Conosco
          </PremiumButton>
        </motion.div>
      </div>
    </section>
  );
}
