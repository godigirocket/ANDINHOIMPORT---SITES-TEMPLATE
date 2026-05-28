import { useState } from 'react';
import { cn } from '@/lib/utils';
import { clientConfig } from '@/config/client';

interface BrandLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

// SVG fallback fiel ao logo real (caso a imagem não carregue)
function FallbackSVG({ size, glow }: { size: number; glow?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Andinho Import"
      style={glow ? { filter: 'drop-shadow(0 0 10px hsla(43,96%,52%,0.5))' } : undefined}
    >
      <circle cx="100" cy="100" r="95" fill="url(#bgG)" />
      <circle cx="100" cy="14" r="5" fill="#555" />
      <circle cx="158" cy="42" r="8" fill="#444" />
      <circle cx="62" cy="168" r="4" fill="#444" />
      <g transform="rotate(-20, 100, 100)">
        <rect x="68" y="45" width="52" height="90" rx="9" fill="url(#pbG)" />
        <rect x="72" y="52" width="44" height="72" rx="5" fill="#050508" />
        <rect x="73" y="53" width="14" height="28" rx="3" fill="white" opacity="0.07" />
        <rect x="84" y="47" width="20" height="3" rx="1.5" fill="#1a1a1a" />
        <rect x="88" y="127" width="12" height="3" rx="1.5" fill="#1a1a1a" />
      </g>
      <circle cx="38" cy="108" r="12" fill="white" opacity="0.92" />
      <circle cx="100" cy="100" r="94" fill="none" stroke="hsl(43,96%,52%)" strokeWidth="1.5" opacity="0.4" />
      <defs>
        <radialGradient id="bgG" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
        <linearGradient id="pbG" x1="68" y1="45" x2="120" y2="135" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BrandLogo({ size = 40, className, glow = false }: BrandLogoProps) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = clientConfig.brand.logoUrl;

  // Se não tem URL ou a imagem falhou, usa SVG
  if (!logoUrl || imgError) {
    return (
      <span className={cn('flex-shrink-0 block', className)}>
        <FallbackSVG size={size} glow={glow} />
      </span>
    );
  }

  return (
    <span
      className={cn('flex-shrink-0 block rounded-full overflow-hidden', className)}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        boxShadow: glow ? '0 0 12px hsla(43,96%,52%,0.45)' : undefined,
      }}
    >
      <img
        src={logoUrl}
        alt={clientConfig.brand.logoAlt}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        style={{ width: size, height: size, objectFit: 'cover', display: 'block' }}
      />
    </span>
  );
}
