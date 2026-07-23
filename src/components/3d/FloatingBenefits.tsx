import { motion } from 'framer-motion';
import { CreditCard, Shield, Package, Truck } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const benefits = [
  { icon: CreditCard, number: '18x', text: 'Parcelamento facilitado', delay: 0 },
  { icon: Shield, number: '12', text: 'Meses de garantia', delay: 0.1 },
  { icon: Package, number: '100%', text: 'Procedência verificada', delay: 0.2 },
  { icon: Truck, number: 'Rápida', text: 'Entrega para sua região', delay: 0.3 },
];

export function FloatingBenefits() {
  const gridRef = useScrollAnimation<HTMLDivElement>('.gsap-item', 0.15);

  return (
    <section className="relative py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #050505 0%, #08080b 50%, #050505 100%)' }}>
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-black text-3xl md:text-4xl tracking-tight text-white mb-3">
            Por que a <span style={{ color: '#F5B700' }}>Andinho Import</span>
          </h2>
          <p className="text-sm" style={{ color: '#a6a6aa' }}>
            Condições reais, sem surpresas.
          </p>
        </motion.div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div
              key={b.text}
              className="gsap-item relative p-6 rounded-2xl text-center group"
              style={{
                background: '#0a0a0c',
                border: '1px solid rgba(245,183,0,0.05)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 30px rgba(245,183,0,0.05)' }}
              />

              <div
                className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(245,183,0,0.08)', border: '1px solid rgba(245,183,0,0.15)' }}
              >
                <b.icon className="w-5 h-5" style={{ color: '#F5B700' }} />
              </div>

              <p className="text-2xl font-black mb-1" style={{ color: '#F5B700' }}>
                {b.number}
              </p>
              <p className="text-xs font-medium" style={{ color: '#ccc' }}>
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
