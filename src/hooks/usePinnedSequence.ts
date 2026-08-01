import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mesma técnica do ProcessShowcase ("03 · Entrega"): a seção prende a tela
 * (position: sticky via CSS + altura de N telas) e o scroll avança um
 * índice por vez, em vez de revelar tudo de uma vez. Só ativa com count > 1
 * (prender a tela pra mostrar 1 coisa só que nunca muda não faz sentido),
 * em telas grandes, e fora de prefers-reduced-motion.
 */
export function usePinnedSequence(count: number) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 992px)');
  const reducedMotion = useReducedMotion();
  const isPinned = count > 1 && isDesktop && !reducedMotion;

  useEffect(() => {
    if (!isPinned) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: () => `+=${window.innerHeight * (count - 1)}`,
      scrub: true,
      onUpdate: (self) => {
        setActive(Math.min(count - 1, Math.floor(self.progress * count)));
      },
    });

    return () => st.kill();
  }, [isPinned, count]);

  return { wrapperRef, active, isPinned };
}
