import { createElement, type ReactNode } from 'react';
import { useReveal } from '@/lib/hooks/useReveal';

interface RevealTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  children: ReactNode;
}

/**
 * Reveal de título padrão do site: cortina que desliza (mask-reveal),
 * disparado uma vez via IntersectionObserver quando entra na viewport.
 * Único componente de heading-reveal — use em todo título do site pra
 * manter o mesmo timing/easing em toda parte.
 */
export function RevealText({ as = 'h2', className = '', children }: RevealTextProps) {
  const ref = useReveal<HTMLElement>();
  return createElement(
    as,
    { ref, className: `mask-reveal ${className}` },
    <span className="mask-reveal-inner">{children}</span>
  );
}
