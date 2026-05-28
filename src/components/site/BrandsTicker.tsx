import { motion } from 'framer-motion';

// Cada marca: ícone SVG real + nome — Apple e JBL com ícone próprio + nome visível
const brands = [
  {
    key: 'xiaomi',
    icon: (
      <svg viewBox="0 0 28 28" width="24" height="24" fill="none">
        <rect width="28" height="28" rx="6" fill="currentColor" opacity="0.18"/>
        <text x="14" y="20" textAnchor="middle"
          fontFamily="Inter,sans-serif" fontWeight="900" fontSize="12"
          fill="currentColor">mi</text>
      </svg>
    ),
    name: 'Xiaomi',
  },
  {
    key: 'samsung',
    icon: (
      <svg viewBox="0 0 26 26" width="24" height="24" fill="none">
        <rect width="26" height="26" rx="5" fill="currentColor" opacity="0.15"/>
        <text x="13" y="18" textAnchor="middle"
          fontFamily="Inter,sans-serif" fontWeight="800" fontSize="8"
          fill="currentColor">SAM</text>
      </svg>
    ),
    name: 'Samsung',
  },
  {
    key: 'jbl',
    icon: (
      // JBL — ícone oval com letras + nome ao lado
      <svg viewBox="0 0 36 24" width="36" height="24" fill="none">
        <rect width="36" height="24" rx="5" fill="currentColor" opacity="0.18"/>
        <text x="18" y="17" textAnchor="middle"
          fontFamily="Inter,sans-serif" fontWeight="900" fontSize="13"
          fill="currentColor">JBL</text>
      </svg>
    ),
    name: 'JBL',
  },
  {
    key: 'sony',
    icon: (
      <svg viewBox="0 0 38 24" width="38" height="24" fill="none">
        <rect width="38" height="24" rx="5" fill="currentColor" opacity="0.15"/>
        <text x="19" y="17" textAnchor="middle"
          fontFamily="Inter,sans-serif" fontWeight="700" fontSize="11"
          letterSpacing="2" fill="currentColor">SONY</text>
      </svg>
    ),
    name: 'Sony',
  },
  {
    key: 'apple',
    icon: (
      // Apple logo SVG oficial
      <svg viewBox="0 0 20 24" width="20" height="24" fill="currentColor">
        <path d="M16.52 12.74c-.02-2.6 2.12-3.85 2.22-3.92-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.14.95-3.95.95-.82 0-2.08-.93-3.42-.9-1.75.02-3.38 1.02-4.28 2.6-1.83 3.17-.47 7.87 1.31 10.45.87 1.25 1.9 2.66 3.26 2.61 1.31-.05 1.8-.84 3.38-.84 1.58 0 2.03.84 3.42.81 1.41-.02 2.3-1.28 3.15-2.54 1-1.45 1.41-2.86 1.43-2.93-.03-.01-2.74-1.05-2.75-4.25zM13.46 4.8c.72-.88 1.21-2.09 1.07-3.3-1.04.04-2.3.69-3.04 1.56-.67.77-1.26 2-1.09 3.18 1.16.09 2.34-.58 3.06-1.44z"/>
      </svg>
    ),
    name: 'Apple',
  },
  {
    key: 'motorola',
    icon: (
      <svg viewBox="0 0 26 26" width="24" height="24" fill="none">
        <circle cx="13" cy="13" r="13" fill="currentColor" opacity="0.15"/>
        <text x="13" y="18" textAnchor="middle"
          fontFamily="Inter,sans-serif" fontWeight="900" fontSize="13"
          fill="currentColor">M</text>
      </svg>
    ),
    name: 'Motorola',
  },
];

// 2x para loop contínuo sem salto
const items = [...brands, ...brands];

export function BrandsTicker() {
  return (
    <div
      className="w-full overflow-hidden select-none"
      style={{
        background: 'hsla(220,20%,5%,1)',
        borderTop: '1px solid hsla(43,96%,52%,0.08)',
        borderBottom: '1px solid hsla(43,96%,52%,0.08)',
        padding: '18px 0',
      }}
    >
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="flex items-center"
        style={{ width: 'max-content' }}
      >
        {items.map((brand, i) => (
          <div
            key={`${brand.key}-${i}`}
            className="flex items-center gap-2.5 px-8 transition-colors duration-300 cursor-default"
            style={{ color: 'hsla(45,20%,96%,0.3)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'hsla(43,96%,52%,0.85)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'hsla(45,20%,96%,0.3)')}
          >
            {/* Ícone */}
            <span className="flex items-center flex-shrink-0">{brand.icon}</span>
            {/* Nome sempre visível */}
            <span
              className="text-[12px] font-bold tracking-[0.12em] uppercase whitespace-nowrap"
            >
              {brand.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
