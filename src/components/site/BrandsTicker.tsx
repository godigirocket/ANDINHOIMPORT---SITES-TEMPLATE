import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Truck, FileCheck2, MapPin, Smartphone } from 'lucide-react';
import { clientConfig } from '@/config/client';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Fatos reais da operação — nada de logo de marca que a loja não vende.
// Isso substitui um "trust bar" genérico por afirmações que batem com o catálogo de verdade (Apple/Xiaomi).
const facts = [
  { icon: ShieldCheck,  label: 'Bateria e tela testadas antes da venda' },
  { icon: FileCheck2,   label: 'Nota fiscal em todo aparelho' },
  { icon: CreditCard,   label: `Até ${clientConfig.features.maxInstallments}x sem juros` },
  { icon: Truck,        label: 'Envio com rastreio para todo o Brasil' },
  { icon: Smartphone,   label: 'Apple e Xiaomi originais' },
  { icon: MapPin,       label: `${clientConfig.company.location.city} · ${clientConfig.company.location.state}` },
];

const items = [...facts, ...facts];

export function BrandsTicker() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="w-full overflow-hidden select-none"
      style={{
        background: 'hsla(220,20%,5%,1)',
        borderTop: '1px solid hsla(43,96%,52%,0.08)',
        borderBottom: '1px solid hsla(43,96%,52%,0.08)',
        padding: '16px 0',
      }}
    >
      <motion.div
        animate={reducedMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        className="flex items-center"
        style={{ width: 'max-content' }}
      >
        {items.map((fact, i) => (
          <div key={i} className="flex items-center gap-2.5 px-8" style={{ color: 'hsla(45,20%,96%,0.45)' }}>
            <fact.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'hsla(43,96%,52%,0.75)' }} />
            <span className="text-[11px] font-bold tracking-[0.08em] uppercase whitespace-nowrap">
              {fact.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
