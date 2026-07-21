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
