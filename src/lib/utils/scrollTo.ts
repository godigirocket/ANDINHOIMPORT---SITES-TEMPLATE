/**
 * Rola até um elemento/seletor respeitando o Lenis (quando ativo) — o
 * scrollIntoView nativo não funciona direito com o smooth scroll do Lenis
 * ligado, porque os dois disputam a posição de scroll no mesmo frame.
 */
export function scrollToElement(target: string | HTMLElement, offset = -72) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(el as HTMLElement, { offset, duration: 1.2 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  }
}
