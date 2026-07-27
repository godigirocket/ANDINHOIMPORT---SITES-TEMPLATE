import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Tilt 3D suave acompanhando o mouse (rotateX/rotateY com spring via GSAP quickTo).
 * Só ativa em dispositivos com mouse fino (hover: hover + pointer: fine) e
 * fora de prefers-reduced-motion — em touch/mobile o elemento fica estático.
 */
export function useTilt3D<T extends HTMLElement = HTMLDivElement>(intensity = 8) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    el.style.transformStyle = 'preserve-3d';

    const setRotateX = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3.out' });
    const setRotateY = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setRotateX(-py * intensity);
      setRotateY(px * intensity);
    };
    const onLeave = () => {
      setRotateX(0);
      setRotateY(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [intensity]);

  return ref;
}
