import { useEffect, useRef } from 'react';

/**
 * Fundo premium: mesh gradient (estático) + spotlight que segue o mouse
 * (via custom properties, throttled por rAF) + noise sutil. Use em seções
 * de destaque (Hero, CTA) — não em toda seção, pra não perder o impacto.
 */
export function MeshBackground({ className = '' }: { className?: string }) {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = parent.getBoundingClientRect();
        el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
        el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
        raf = 0;
      });
    };
    parent.addEventListener('mousemove', onMove);
    return () => {
      parent.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div className="mesh-bg-gradient" />
      <div ref={spotRef} className="mesh-bg-spotlight" />
      <div className="mesh-bg-noise" />
    </div>
  );
}
