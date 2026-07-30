import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Cursor customizado (ponto + anel) que segue o mouse com leve atraso.
 * Só ativa em desktop com mouse fino e fora de reduced-motion — em touch
 * o componente não faz nada (o CSS também esconde por garantia dupla).
 */
export function PremiumCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.('a, button, [role="button"], input, textarea, select')) {
        ring.classList.add('cursor-ring-active');
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.('a, button, [role="button"], input, textarea, select')) {
        ring.classList.remove('cursor-ring-active');
      }
    };

    document.body.classList.add('has-premium-cursor');
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      document.body.classList.remove('has-premium-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="premium-cursor-dot" />
      <div ref={ringRef} className="premium-cursor-ring-wrap">
        <div className="premium-cursor-ring-visual" />
      </div>
    </>
  );
}
