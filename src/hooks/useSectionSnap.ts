import { useEffect } from 'react';

/**
 * Scroll dirigido, seção por vez — via Lenis (não CSS scroll-snap, que não
 * engata de forma confiável com o smooth-scroll do site).
 *
 * Regra: seções que cabem numa tela ("atômicas") sempre avançam inteiras a
 * cada scroll. Seções mais altas que a tela (catálogo, FAQ) só "engatam"
 * perto da borda de entrada/saída — no meio delas o scroll continua livre,
 * senão dá pra ver a lista inteira de produtos ou perguntas.
 */
export function useSectionSnap() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // toque fica com scroll nativo

    const HEADER_OFFSET = 80;
    const BOUNDARY_ZONE = 140;
    const ANIM_GUARD_MS = 900;

    let animating = false;
    let animEndTimer: number | null = null;

    const getSections = () =>
      Array.from(document.querySelectorAll<HTMLElement>('main > section')).filter(el => el.offsetHeight > 0);

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 2) return;
      if (animating) { e.preventDefault(); e.stopPropagation(); return; }

      const sections = getSections();
      if (sections.length === 0) return;

      const scrollY = window.scrollY;
      const tops = sections.map(s => s.getBoundingClientRect().top + scrollY - HEADER_OFFSET);

      let idx = 0;
      for (let i = 0; i < tops.length; i++) {
        if (tops[i] <= scrollY + 2) idx = i;
      }

      const curTop = tops[idx];
      const curHeight = sections[idx].offsetHeight;
      const atomic = curHeight <= window.innerHeight * 1.15;
      const distFromTop = scrollY - curTop;
      const distFromBottom = curTop + curHeight - (scrollY + window.innerHeight);

      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      let targetIdx: number | null = null;
      if (atomic) {
        if (goingDown && idx < sections.length - 1) targetIdx = idx + 1;
        else if (goingUp && idx > 0) targetIdx = idx - 1;
      } else {
        if (goingDown && distFromBottom < BOUNDARY_ZONE && idx < sections.length - 1) targetIdx = idx + 1;
        else if (goingUp && distFromTop < BOUNDARY_ZONE && idx > 0) targetIdx = idx - 1;
      }

      if (targetIdx === null) return; // dentro de uma seção alta — scroll livre, sem interceptar

      // Precisa vencer o próprio listener de wheel do Lenis (que rodaria o
      // scroll dele por cima do nosso) — captura + stopPropagation garante
      // que só o snap processa este tick específico.
      e.preventDefault();
      e.stopPropagation();
      animating = true;
      const targetY = Math.max(0, tops[targetIdx]);
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 1, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
      if (animEndTimer) window.clearTimeout(animEndTimer);
      animEndTimer = window.setTimeout(() => { animating = false; }, ANIM_GUARD_MS);
    };

    // capture:true — precisa rodar antes do listener de wheel do Lenis (registrado
    // em bubble phase) pra poder vetoar o gesto com stopPropagation quando for snapar.
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      if (animEndTimer) window.clearTimeout(animEndTimer);
    };
  }, []);
}
