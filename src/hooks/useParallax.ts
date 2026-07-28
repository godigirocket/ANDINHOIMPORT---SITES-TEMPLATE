import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax de profundidade: move o elemento verticalmente conforme o scroll
 * da seção que o contém. speed positivo = mais lento que o scroll (fundo);
 * speed negativo = mais rápido (primeiro plano). Desliga em reduced-motion
 * e usa translate3d via GSAP (GPU-friendly, sem afetar layout).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const trigger = el.closest('section') ?? el.parentElement ?? el;
    const distance = window.innerHeight * speed;

    gsap.set(el, { y: -distance / 2, force3D: true });

    const tween = gsap.to(el, {
      y: distance / 2,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed]);

  return ref;
}
