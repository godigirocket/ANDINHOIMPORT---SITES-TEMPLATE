/**
 * Ripple compartilhado por todo botão do site (PremiumButton e botões
 * aninhados que não podem usar o componente por causa de stopPropagation).
 * Só existe durante o clique — remove o próprio elemento ao terminar.
 */
export function spawnRipple(container: HTMLElement, clientX: number, clientY: number) {
  const rect = container.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.6;
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${clientX - rect.left - size / 2}px`;
  ripple.style.top = `${clientY - rect.top - size / 2}px`;
  container.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}
