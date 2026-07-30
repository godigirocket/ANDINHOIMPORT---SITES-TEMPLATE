import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Efeito magnético: o elemento se desloca sutilmente em direção ao cursor
 * dentro dos próprios limites. Só ativa com mouse fino (desktop) e fora de
 * reduced-motion. transform-only (x/y via GSAP), sem custo em idle.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const setX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const setY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      setX(relX * strength);
      setY(relY * strength);
    };
    const onLeave = () => { setX(0); setY(0); };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}
