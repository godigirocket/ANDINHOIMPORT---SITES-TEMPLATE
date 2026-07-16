import { motion } from 'framer-motion';

interface SectionDividerProps {
  from?: string;
  to?: string;
  flip?: boolean;
  className?: string;
}

/**
 * Divisor curvo SVG entre seções — padrão 2026.
 * Nunca deixa duas seções com corte reto.
 */
export function SectionDivider({ 
  from = 'hsl(220,20%,4%)', 
  to = 'hsl(225,25%,6%)',
  flip = false,
  className = ''
}: SectionDividerProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} 
      style={{ marginTop: '-1px', marginBottom: '-1px' }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`block w-full h-12 sm:h-16 md:h-20 ${flip ? 'rotate-180' : ''}`}
        aria-hidden="true"
      >
        <path
          d="M0,0 C360,70 1080,70 1440,0 L1440,80 L0,80 Z"
          fill={to}
        />
        <path
          d="M0,0 C360,70 1080,70 1440,0"
          fill="none"
          stroke="hsla(43,96%,52%,0.08)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

/**
 * Divisor com glow animado — para transições premium
 */
export function SectionDividerGlow({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full py-6 flex items-center justify-center ${className}`}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, hsla(43,96%,52%,0.5), transparent)',
        }}
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: 'hsl(43,96%,52%)',
          boxShadow: '0 0 12px hsla(43,96%,52%,0.6)',
        }}
      />
    </div>
  );
}
