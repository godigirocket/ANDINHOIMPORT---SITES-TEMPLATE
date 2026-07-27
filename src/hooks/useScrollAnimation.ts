import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook que anima filhos de um container ao entrarem na viewport.
 * Cada filho entra com stagger, translateY e fade.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  selector = '.gsap-item',
  stagger = 0.12
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeitar prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = el.querySelectorAll(selector);
    if (items.length === 0) return;

    gsap.set(items, { y: 40, opacity: 0 });

    const tl = gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger,
      ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [selector, stagger]);

  return ref;
}

/**
 * Variante mais forte: filhos entram com rotação 3D (perspectiva + rotateX)
 * além de translateY/fade — para headers e cards que pedem mais impacto.
 */
export function useScrollReveal3D<T extends HTMLElement = HTMLDivElement>(
  selector = '.reveal3d-item',
  stagger = 0.12
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = el.querySelectorAll(selector);
    if (items.length === 0) return;

    gsap.set(items, { y: 60, opacity: 0, rotateX: -25, transformPerspective: 900, transformOrigin: '50% 100%' });

    const tl = gsap.to(items, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.9,
      stagger,
      ease: 'power4.out',
      clearProps: 'transform',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        once: true,
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [selector, stagger]);

  return ref;
}
