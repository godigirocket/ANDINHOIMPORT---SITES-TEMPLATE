import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Smooth scroll global via Lenis, sincronizado ao ticker do GSAP para que
 * todo o parallax/ScrollTrigger do site fique preciso e sem stutter.
 * Desligado automaticamente em prefers-reduced-motion (scroll nativo).
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Recalcula as posições do ScrollTrigger depois que imagens carregadas
  // assincronamente (produtos do Supabase, fotos remotas) mudam a altura da
  // página — sem isso, um reveal calculado antes da imagem carregar pode
  // travar no estado inicial (nunca dispara na posição certa).
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t1 = setTimeout(refresh, 1200);
    const t2 = setTimeout(refresh, 3000);
    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Links de âncora (#hero, #products...) e chamadas a scrollIntoView
    // nativo brigam com o Lenis (ele tenta "corrigir" de volta pro alvo
    // antigo no frame seguinte). Interceptamos cliques em <a href="#...">
    // e roteamos pelo Lenis, que é quem realmente controla o scroll.
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.2 });
    };
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
