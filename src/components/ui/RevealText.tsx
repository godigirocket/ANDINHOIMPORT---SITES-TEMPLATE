import { createElement, type ReactNode } from 'react';
import { useReveal } from '@/lib/hooks/useReveal';

interface RevealTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  children: ReactNode;
  /**
   * 'mask' (padrão): cortina + blur + scale em bloco — todo título do site.
   * 'stagger-words': mesmo reveal, mas por palavra — reservado pro H1 do
   * Hero e pro headline do CTA, pra dar hierarquia sem inventar um efeito novo.
   */
  variant?: 'mask' | 'stagger-words';
  /**
   * Classe aplicada no span interno (onde o texto de fato vive) em vez do
   * wrapper externo — necessário pra .gradient-text, já que background-clip:text
   * só funciona no elemento que contém o texto diretamente.
   */
  innerClassName?: string;
}

/**
 * Reveal de título padrão do site: cortina que desliza + blur + scale,
 * disparado uma vez via IntersectionObserver quando entra na viewport.
 * Único componente de heading-reveal — use em todo título do site pra
 * manter o mesmo timing/easing em toda parte.
 */
export function RevealText({ as = 'h2', className = '', children, variant = 'mask', innerClassName = '' }: RevealTextProps) {
  const ref = useReveal<HTMLElement>();

  if (variant === 'stagger-words' && typeof children === 'string') {
    const words = children.split(' ');
    return createElement(
      as,
      { ref, className: `stagger-words ${className}` },
      words.map((word, i) => (
        <span key={i} className="word">
          <span className="word-inner" style={{ '--word-delay': `${i * 70}ms` } as React.CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))
    );
  }

  return createElement(
    as,
    { ref, className: `mask-reveal ${className}` },
    <span className={`mask-reveal-inner ${innerClassName}`}>{children}</span>
  );
}
