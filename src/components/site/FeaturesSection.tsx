import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CreditCard, FileCheck2, Headphones, ShieldCheck, type LucideIcon } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { RevealText } from '@/components/ui/RevealText';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useParallax } from '@/hooks/useParallax';

interface StatItem {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
}

const stats: StatItem[] = [
  { icon: CreditCard, value: clientConfig.features.maxInstallments, suffix: 'x', label: 'sem juros no cartao' },
  { icon: ShieldCheck, value: 100, suffix: '%', label: 'produtos originais' },
  { icon: FileCheck2, value: 1, label: 'nota fiscal em todo aparelho' },
  { icon: Headphones, value: 1, label: 'atendimento humano direto' },
];

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || value === 0) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const duration = 950;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.max(1, Math.round(value * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export function FeaturesSection() {
  const waUrl = `https://wa.me/${clientConfig.company.contact.whatsappNumber}?text=${encodeURIComponent(clientConfig.company.contact.whatsappMessage)}`;
  const glowRef = useParallax<HTMLDivElement>(0.25);

  return (
    <section id="features" className="relative py-14 md:py-20 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(240,6%,11%) 0%, hsl(224,24%,14%) 52%, hsl(240,6%,11%) 100%)' }} />
      <div ref={glowRef} className="absolute top-1/2 left-1/2 w-[min(760px,92vw)] h-[360px] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(ellipse, hsla(43,96%,52%,0.08) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="mb-10 max-w-xl">
          <RevealText as="h2" className="font-display font-bold tracking-tight mb-3 text-white">
            <span style={{ fontSize: 'clamp(1.45rem, 2.2vw, 2.1rem)' }}>
            Compra clara, produto original
            </span>
          </RevealText>
          <motion.p initial={{ y: 12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="text-sm leading-relaxed" style={{ color: 'hsla(45,20%,96%,0.58)' }}>
            Condicoes simples, nota fiscal e atendimento direto para confirmar modelo, cor e estoque.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-xl p-5 min-h-[168px]"
              style={{
                background: 'linear-gradient(145deg, hsla(220,16%,18%,0.96), hsla(240,6%,12%,0.98))',
                border: '1px solid hsla(43,96%,52%,0.14)',
                boxShadow: '0 18px 40px rgba(0,0,0,0.22)',
              }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsla(43,96%,52%,0.75), transparent)' }} />
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ background: 'hsla(43,96%,52%,0.1)', border: '1px solid hsla(43,96%,52%,0.18)' }}>
                <s.icon className="w-4 h-4" style={{ color: 'hsl(43,96%,52%)' }} />
              </div>
              <p className="font-display font-black leading-none mb-3 text-white tabular-nums" style={{ fontSize: 'clamp(2.15rem, 4vw, 3rem)' }}>
                {s.label.includes('nota fiscal') || s.label.includes('atendimento')
                  ? <span>{s.label.includes('nota fiscal') ? 'NF' : '1:1'}</span>
                  : <CountUp value={s.value} suffix={s.suffix} />}
              </p>
              <p className="text-sm leading-relaxed max-w-[22ch]" style={{ color: 'hsla(45,20%,96%,0.58)' }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ y: 16, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl"
          style={{ background: 'hsla(43,96%,52%,0.07)', border: '1px solid hsla(43,96%,52%,0.16)' }}>
          <div className="min-w-0">
            <p className="font-bold text-base text-white">Quer consultar um modelo?</p>
            <p className="text-sm" style={{ color: 'hsla(45,20%,96%,0.55)' }}>Chame no WhatsApp e confirme estoque, cor e parcelamento.</p>
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
